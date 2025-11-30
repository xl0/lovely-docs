import * as p from '@clack/prompts';
import { Command } from 'commander';
import { existsSync } from 'fs';
import { join } from 'path';
import pc from 'picocolors';
import { ConfigManager } from '../lib/config.js';
import { getLibrarySummaries, loadLibrariesFromJson } from '../lib/doc-cache.js';
import { DocRepo, getRepoPath } from '../lib/doc-repo.js';
import { Installer } from '../lib/installer.js';

interface LibraryInfo {
	id: string;
	name: string;
	ecosystems: string[];
}

export const updateCommand = new Command('update')
	.description('Update installed documentation libraries')
	.alias('u')
	.action(async () => {
		const configManager = new ConfigManager();
		const config = await configManager.load();

		if (!config) {
			console.error(pc.red('Project not initialized. Run `npx lovely-docs init` first.'));
			process.exit(1);
		}

		if (config.installed.length === 0) {
			console.log(pc.yellow('No libraries installed.'));
			return;
		}

		// Determine doc_db path from config
		let docDbPath: string;
		if (config.source.type === 'local') {
			docDbPath = config.source.docDir;
		} else {
			const repoPath = getRepoPath(config.source.gitCacheDir, config.source.repo);
			const docRepo = new DocRepo(repoPath);
			docDbPath = await docRepo.sync(config.source.repo, config.source.branch);
		}

		const targetDir = join(process.cwd(), config.installDir);
		const librariesDb = await loadLibrariesFromJson(docDbPath);
		const librariesMap = getLibrarySummaries(librariesDb);
		const libraries: LibraryInfo[] = Array.from(librariesMap.entries()).map(([id, lib]) => ({
			id,
			name: lib.name,
			ecosystems: lib.ecosystems
		}));
		const installer = new Installer(docDbPath, targetDir);

		p.intro(pc.bold('Update Documentation Libraries'));

		const s = p.spinner();
		s.start('Updating libraries...');

		let successCount = 0;
		let failCount = 0;

		for (const libId of config.installed) {
			const library = libraries.find((l) => l.id === libId);
			const libName = library?.name || libId;

			s.message(`Updating ${libName}...`);

			try {
				// Check if library still exists in doc_db
				const libPath = join(docDbPath, libId);
				if (!existsSync(libPath)) {
					console.error(pc.red(`\nLibrary '${libId}' not found in documentation database. Skipping.`));
					failCount++;
					continue;
				}

				await installer.install(libId);
				successCount++;
			} catch (e) {
				console.error(pc.red(`\nFailed to update ${libName}:`), e);
				failCount++;
			}
		}

		s.stop(`Update complete. ${successCount} updated, ${failCount} failed.`);
		p.outro(pc.green('Done!'));
	});
