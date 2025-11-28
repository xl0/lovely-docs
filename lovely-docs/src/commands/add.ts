import { Command } from 'commander';
import * as p from '@clack/prompts';
import pc from 'picocolors';
import { ConfigManager } from '../lib/config.js';
import { DocRepo, getDocDbPath, getRepoPath } from '../lib/doc-repo.js';
import { loadLibrariesFromJson, getLibrarySummaries } from '../lib/doc-cache.js';
import { Installer } from '../lib/installer.js';
import { join } from 'path';
import { existsSync } from 'fs';
interface LibraryInfo {
	id: string;
	name: string;
	ecosystems: string[];
}

export const addCommand = new Command('add')
	.description('Add a documentation library to your project')
	.argument('[library]', 'Library name or ID to add')
	.alias('a')
	.option('--all', 'Add all available libraries')
	.action(async (libraryInput, options) => {
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
			const repoPath = getRepoPath(config.source.gitCacheDir, config.source.repo);
			const docRepo = new DocRepo(repoPath);
			docDbPath = await docRepo.sync(config.source.repo, config.source.branch);
		}

		const targetDir = join(process.cwd(), config.installDir);

		// Get all libraries
		let librariesDb;
		try {
			librariesDb = await loadLibrariesFromJson(docDbPath);
		} catch (e) {
			console.error(pc.red(`Failed to list libraries from ${docDbPath}:`), e);
			return;
		}

		const librariesMap = getLibrarySummaries(librariesDb);
		const libraries: LibraryInfo[] = Array.from(librariesMap.entries()).map(([id, lib]) => ({
			id,
			name: lib.name,
			ecosystems: lib.ecosystems
		}));

		if (libraries.length === 0) {
			console.log(pc.yellow('No libraries available.'));
			return;
		}

		let librariesToAdd: string[] = [];

		if (options.all) {
			// Add all libraries
			librariesToAdd = libraries.map((l: LibraryInfo) => l.id);
		} else if (!libraryInput) {
			// Interactive mode
			p.intro(pc.bold('Add Documentation Libraries'));

			// Group by ecosystem
			const ecosystems = new Set<string>();
			for (const lib of libraries) {
				for (const eco of lib.ecosystems) {
					ecosystems.add(eco);
				}
			}
			const allEcosystems = Array.from(ecosystems);

			// Determine initial selection
			const initialEcosystems =
				config.ecosystems && config.ecosystems.length > 0 ? config.ecosystems.filter((e) => ecosystems.has(e)) : allEcosystems;

			// Select ecosystems
			const selectedEcosystems = await p.multiselect({
				message: 'Select ecosystems:',
				options: allEcosystems.map((eco) => ({ value: eco, label: eco })),
				initialValues: initialEcosystems,
				required: true
			});

			if (p.isCancel(selectedEcosystems)) {
				p.cancel('Operation cancelled.');
				process.exit(0);
			}

			// Save selected ecosystems to config
			const newEcosystems = selectedEcosystems as string[];
			if (JSON.stringify(config.ecosystems) !== JSON.stringify(newEcosystems)) {
				config.ecosystems = newEcosystems;
				await configManager.save(config);
			}

			// Filter libraries by ecosystem
			const filteredLibs = libraries.filter((lib: LibraryInfo) => lib.ecosystems.some((eco: string) => newEcosystems.includes(eco)));

			if (filteredLibs.length === 0) {
				p.outro(pc.yellow('No libraries match the selected ecosystems.'));
				return;
			}

			// Select libraries
			const selectedLibs = await p.multiselect({
				message: 'Select libraries to add:',
				options: filteredLibs.map((lib: LibraryInfo) => ({
					value: lib.id,
					label: `${lib.name} → ${config.installDir}/${lib.id}${config.installed.includes(lib.id) ? ' (installed)' : ''}`
				}))
			});

			if (p.isCancel(selectedLibs)) {
				p.cancel('Operation cancelled.');
				process.exit(0);
			}

			librariesToAdd = selectedLibs as string[];
		} else {
			// Single library by name or ID
			const libByName = libraries.find((l: LibraryInfo) => l.name === libraryInput);
			const libById = libraries.find((l: LibraryInfo) => l.id === libraryInput);

			if (!libById && !libByName) {
				console.error(pc.red(`Library '${libraryInput}' not found in documentation database.`));
				console.log(pc.yellow('Run `npx lovely-docs list` to see available libraries.'));
				process.exit(1);
			}

			const library = libById || libByName!;
			librariesToAdd = [library.id];
		}

		if (librariesToAdd.length === 0) {
			console.log(pc.yellow('No libraries selected.'));
			return;
		}

		// Install libraries
		for (const libraryId of librariesToAdd) {
			const library = libraries.find((l: LibraryInfo) => l.id === libraryId);
			if (!library) continue;

			// Check if library exists in doc_db
			const libPath = join(docDbPath, libraryId);
			if (!existsSync(libPath)) {
				console.error(pc.red(`Library '${libraryId}' not found in documentation database.`));
				continue;
			}

			// Check if already installed
			const targetLibDir = join(targetDir, libraryId);
			if (existsSync(targetLibDir)) {
				const shouldOverwrite = await p.confirm({
					message: `Library '${library.name}' is already installed. Overwrite?`,
					initialValue: false
				});

				if (p.isCancel(shouldOverwrite) || !shouldOverwrite) {
					console.log(pc.yellow(`Skipped ${library.name}`));
					continue;
				}
			}

			const s = p.spinner();
			s.start(`Installing ${library.name}...`);

			try {
				const installer = new Installer(docDbPath, targetDir);
				await installer.install(libraryId);

				// Update config
				if (!config.installed.includes(libraryId)) {
					config.installed.push(libraryId);
				}

				s.stop(`✓ Installed ${library.name} → ${config.installDir}/${libraryId}`);
			} catch (e) {
				s.stop(`✗ Failed to install ${library.name}`);
				console.error(e);
			}
		}

		// Save config once at the end
		await configManager.save(config);

		if (librariesToAdd.length > 1) {
			p.outro(pc.green(`Installed ${librariesToAdd.length} libraries`));
		}
	});
