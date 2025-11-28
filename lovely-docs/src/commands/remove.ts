import * as p from '@clack/prompts';
import { Command } from 'commander';
import fs from 'fs-extra';
import { join } from 'path';
import pc from 'picocolors';
import { ConfigManager } from '../lib/config.js';
import { loadLibrariesFromJson, getLibrarySummaries } from '../lib/doc-cache.js';
import { getDocDbPath, getRepoPath } from '../lib/doc-repo.js';

interface LibraryInfo {
	id: string;
	name: string;
	ecosystems: string[];
}

export const removeCommand = new Command('remove')
	.description('Remove a documentation library from your project')
	.argument('[library]', 'Library name or ID to remove')
	.alias('rm')
	.option('--all', 'Remove all installed libraries')
	.action(async (libraryInput, options) => {
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
			docDbPath = getDocDbPath(repoPath);
		}

		const librariesDb = await loadLibrariesFromJson(docDbPath);
		const librariesMap = getLibrarySummaries(librariesDb);
		const libraries: LibraryInfo[] = Array.from(librariesMap.entries()).map(([id, lib]) => ({
			id,
			name: lib.name,
			ecosystems: lib.ecosystems
		}));
		const targetDir = join(process.cwd(), config.installDir);

		let librariesToRemove: string[] = [];

		if (options.all) {
			// Remove all
			librariesToRemove = [...config.installed];
		} else if (!libraryInput) {
			// Interactive selection
			const installedLibs = libraries.filter((l) => config.installed.includes(l.id));

			if (installedLibs.length === 0) {
				// Fallback if we can't find library info but have IDs in config
				if (config.installed.length > 0) {
					librariesToRemove = [...config.installed]; // Or handle differently?
					// Actually, let's just list the IDs if we can't find info
					const selected = await p.multiselect({
						message: 'Select libraries to remove:',
						options: config.installed.map((id) => {
							const lib = libraries.find((l) => l.id === id);
							return {
								value: id,
								label: lib ? `${lib.name} → ${config.installDir}/${lib.id}` : id
							};
						})
					});

					if (p.isCancel(selected)) {
						p.cancel('Operation cancelled.');
						process.exit(0);
					}
					librariesToRemove = selected as string[];
				} else {
					console.log(pc.yellow('No libraries installed.'));
					return;
				}
			} else {
				const selected = await p.multiselect({
					message: 'Select libraries to remove:',
					options: installedLibs.map((lib) => ({
						value: lib.id,
						label: `${lib.name} → ${config.installDir}/${lib.id}`
					}))
				});

				if (p.isCancel(selected)) {
					p.cancel('Operation cancelled.');
					process.exit(0);
				}

				librariesToRemove = selected as string[];
			}
		} else {
			// Single library by name or ID
			const libByName = libraries.find((l) => l.name === libraryInput);
			const libById = libraries.find((l) => l.id === libraryInput);

			// If we can't find it in the repo, but it's in installed, allow removing by ID
			if (!libById && !libByName && config.installed.includes(libraryInput)) {
				librariesToRemove = [libraryInput];
			} else if (!libById && !libByName) {
				console.error(pc.red(`Library '${libraryInput}' not found.`));
				process.exit(1);
			} else {
				const library = libById || libByName!;
				if (!config.installed.includes(library.id)) {
					console.error(pc.red(`Library '${library.name}' is not installed.`));
					process.exit(1);
				}
				librariesToRemove = [library.id];
			}
		}

		if (librariesToRemove.length === 0) {
			console.log(pc.yellow('No libraries selected.'));
			return;
		}

		// Remove libraries
		for (const libraryId of librariesToRemove) {
			const library = libraries.find((l) => l.id === libraryId);
			const libraryName = library?.name || libraryId;

			try {
				const targetLibDir = join(targetDir, libraryId);
				const targetLibFile = join(targetDir, `${libraryId}.md`);
				const targetLibOrigFile = join(targetDir, `${libraryId}.orig.md`);

				await fs.remove(targetLibDir);
				await fs.remove(targetLibFile);
				await fs.remove(targetLibOrigFile);

				console.log(pc.green(`✓ Removed ${libraryName}`));
			} catch (e) {
				console.error(pc.red(`✗ Failed to remove ${libraryName}:`), e);
			}
		}

		// Update config
		config.installed = config.installed.filter((id: string) => !librariesToRemove.includes(id));
		await configManager.save(config);
	});
