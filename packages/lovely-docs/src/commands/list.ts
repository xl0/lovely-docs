import { Command } from 'commander';
import pc from 'picocolors';
import { ConfigManager } from '../lib/config.js';
import { getLibrarySummaries, loadLibrariesFromJson } from '../lib/doc-cache.js';
import { DocRepo } from '../lib/doc-repo.js';

export const listCommand = new Command('list')
	.description('List available documentation libraries')
	.alias('l')
	.action(async () => {
		const configManager = new ConfigManager();
		const config = await configManager.load();

		if (!config) {
			console.error(pc.red('Project not initialized. Run `npx lovely-docs init` first.'));
			process.exit(1);
		}

		// Determine doc_db path from config
		let docDbPath: string;
		if (config.source.type === 'local') {
			docDbPath = config.source.docDir;
		} else {
			const docRepo = new DocRepo(config.source.gitCacheDir);
			docDbPath = await docRepo.sync(config.source.repo, config.source.branch);
		}

		let librariesDb;
		try {
			librariesDb = await loadLibrariesFromJson(docDbPath);
		} catch (e) {
			console.error(pc.red(`Failed to list libraries from ${docDbPath}:`), e);
			return;
		}

		const librariesMap = getLibrarySummaries(librariesDb);
		const libraries = Array.from(librariesMap.entries()).map(([id, lib]) => ({
			id,
			name: lib.name,
			ecosystems: lib.ecosystems
		}));

		if (libraries.length === 0) {
			console.log(pc.yellow('No libraries found. Try running `npx lovely-docs init` again to sync.'));
			return;
		}

		console.log(pc.bold('\nAvailable Libraries:'));

		// Group by ecosystem
		const byEcosystem: Record<string, typeof libraries> = {};
		const noEcosystem: typeof libraries = [];

		for (const lib of libraries) {
			if (lib.ecosystems.length === 0) {
				noEcosystem.push(lib);
			} else {
				for (const eco of lib.ecosystems) {
					byEcosystem[eco] = byEcosystem[eco] || [];
					byEcosystem[eco].push(lib);
				}
			}
		}

		for (const [eco, libs] of Object.entries(byEcosystem)) {
			console.log(pc.cyan(`\n${eco}:`));
			for (const lib of libs) {
				const installed = config.installed.includes(lib.id) ? pc.green(' (installed)') : '';
				const path = pc.gray(` → ${config.installDir}/${lib.id}`);
				console.log(`  ${pc.white(lib.name)}${path}${installed}`);
			}
		}

		if (noEcosystem.length > 0) {
			console.log(pc.cyan('\nOther:'));
			for (const lib of noEcosystem) {
				const installed = config.installed.includes(lib.id) ? pc.green(' (installed)') : '';
				const path = pc.gray(` → ${config.installDir}/${lib.id}`);
				console.log(`  ${pc.white(lib.name)}${path}${installed}`);
			}
		}
		console.log('');
	});
