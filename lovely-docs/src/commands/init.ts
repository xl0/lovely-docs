import * as p from '@clack/prompts';
import { Command } from 'commander';
import pc from 'picocolors';
import { ConfigManager } from '../lib/config.js';
import { DocRepo, getCacheDir, getRepoPath } from '../lib/doc-repo.js';
import { join } from 'path';

export const initCommand = new Command('init')
	.description('Initialize lovely-docs in your project')
	.option('-q, --quiet', 'Skip prompts and use defaults')
	.option('--repo <url>', 'Git repository URL')
	.option('--branch <name>', 'Git branch name')
	.option('--git-cache-dir <path>', 'Git cache directory')
	.option('--doc-dir <path>', 'Direct path to doc_db directory (skips git)')
	.action(async (options) => {
		const configManager = new ConfigManager();
		const existingConfig = await configManager.load();

		if (existingConfig && !options.quiet) {
			const shouldReinit = await p.confirm({
				message: 'Project already initialized. Reinitialize?',
				initialValue: false
			});

			if (p.isCancel(shouldReinit) || !shouldReinit) {
				p.cancel('Operation cancelled.');
				process.exit(0);
			}
		}

		p.intro(pc.bold('Initialize Lovely Docs'));

		let repo: string | undefined = options.repo || 'https://github.com/xl0/lovely-docs';
		let branch: string | undefined = options.branch || 'master';
		let docDir: string | undefined = options.docDir;
		let gitCacheDir: string | undefined = undefined;

		let sourceType: 'local' | 'git' = options.docDir ? 'local' : 'git';

		if (!options.quiet) {
			// Interactive mode
			let choice = await p.select({
				message: 'Source:',
				options: [
					{ value: 'git', label: 'Git Repository' },
					{ value: 'local', label: 'Local Directory' }
				] as const,
				initialValue: sourceType
			});

			if (p.isCancel(choice)) {
				p.cancel('Operation cancelled.');
				process.exit(0);
			}

			sourceType = choice;

			if (sourceType === 'git') {
				let choice = await p.text({
					message: 'Git repository URL:',
					initialValue: repo,
					placeholder: repo
				});

				if (p.isCancel(choice)) {
					p.cancel('Operation cancelled.');
					process.exit(0);
				}

				repo = choice;

				choice = await p.text({
					message: 'Git branch:',
					initialValue: branch,
					placeholder: branch
				});

				if (p.isCancel(choice)) {
					p.cancel('Operation cancelled.');
					process.exit(0);
				}

				branch = choice;

				const baseCacheDir = join(getCacheDir(), 'lovely-docs');
				gitCacheDir = options.gitCacheDir || getRepoPath(baseCacheDir, repo);

				choice = await p.text({
					message: 'Git cache directory:',
					initialValue: gitCacheDir,
					placeholder: gitCacheDir
				});

				if (p.isCancel(choice)) {
					p.cancel('Operation cancelled.');
					process.exit(0);
				}

				gitCacheDir = choice;

				const s = p.spinner();
				s.start('Syncing documentation repository...');

				try {
					const docRepo = new DocRepo(gitCacheDir);
					await docRepo.sync(repo, branch);
					s.stop('Documentation repository synced');
				} catch (e) {
					s.stop('Failed to sync repository');
					console.error(e);
					process.exit(1);
				}
			} else {
				// Local directory instead of git.
				let choice = await p.text({
					message: 'Local doc_db directory path:',
					initialValue: docDir ?? './doc_db',
					placeholder: docDir ?? './doc_db'
				});

				if (p.isCancel(choice)) {
					p.cancel('Operation cancelled.');
					process.exit(0);
				}

				docDir = choice;
			}
		}

		let installDir = existingConfig?.installDir || 'lovely-docs';
		let installMode: 'digest' | 'fulltext' | 'both' = existingConfig?.installs || 'digest';
		let includeSummaries = existingConfig?.summaries || false;
		let includeLlmMap = existingConfig?.llms_map ?? true;

		if (!options.quiet) {
			const choice = await p.text({
				message: 'Installation directory:',
				initialValue: installDir,
				placeholder: installDir
			});

			if (p.isCancel(choice)) {
				p.cancel('Operation cancelled.');
				process.exit(0);
			}
			installDir = choice;

			// Ask for default installation mode
			const modeSelection = await p.select({
				message: 'Default installation mode:',
				options: [
					{ value: 'both', label: 'Both (Digest + Fulltext)', hint: '.md and .fulltext.md' },
					{ value: 'digest', label: 'Digest Only' },
					{ value: 'fulltext', label: 'Fulltext Only' }
				],
				initialValue: installMode
			});

			if (p.isCancel(modeSelection)) {
				p.cancel('Operation cancelled.');
				process.exit(0);
			}
			installMode = modeSelection as 'digest' | 'fulltext' | 'both';

			// Ask for summaries
			const summariesSelection = await p.confirm({
				message: 'Install directory summaries by default?',
				initialValue: includeSummaries
			});

			if (p.isCancel(summariesSelection)) {
				p.cancel('Operation cancelled.');
				process.exit(0);
			}
			includeSummaries = summariesSelection;

			// Ask for LLM Map
			const llmsMapSelection = await p.confirm({
				message: 'Generate LLM_MAP.md by default?',
				initialValue: existingConfig?.llms_map ?? true
			});

			if (p.isCancel(llmsMapSelection)) {
				p.cancel('Operation cancelled.');
				process.exit(0);
			}
			includeLlmMap = llmsMapSelection;
		}

		// Save configuration
		const configToSave =
			sourceType === 'local'
				? {
						source: {
							type: 'local' as const,
							docDir: docDir!
						},
						ecosystems: existingConfig?.ecosystems,
						installed: existingConfig?.installed || [],
						installs: installMode,
						summaries: includeSummaries,
						llms_map: includeLlmMap,
						installDir
					}
				: {
						source: {
							type: 'git' as const,
							repo: repo!,
							branch: branch!,
							gitCacheDir: gitCacheDir!
						},
						ecosystems: existingConfig?.ecosystems,
						installed: existingConfig?.installed || [],
						installs: installMode,
						summaries: includeSummaries,
						llms_map: includeLlmMap,
						installDir
					};

		await configManager.save(configToSave);

		// Update .gitignore
		// 		const gitignorePath = join(process.cwd(), '.gitignore');
		// 		try {
		// 			if (await fs.pathExists(gitignorePath)) {
		// 				const content = await fs.readFile(gitignorePath, 'utf-8');
		// 				if (!content.includes(installDir)) {
		// 					await fs.appendFile(gitignorePath, `\n${installDir}\n`);
		// 					console.log(pc.gray(`Added ${installDir} to .gitignore`));
		// 				}
		// 			} else {
		// 				await fs.writeFile(gitignorePath, `${installDir}\n`);
		// 				console.log(pc.gray(`Created .gitignore with ${installDir}`));
		// 			}
		// 		} catch (e) {
		// 			console.error(pc.yellow('Failed to update .gitignore'), e);
		// 		}

		// Generate Rules
		// 		if (!options.quiet) {
		// 			const ruleTargets = [
		// 				{ label: 'Cursor', value: 'cursor', path: '.cursor/rules/lovely-docs.mdc' },
		// 				{ label: 'Windsurf', value: 'windsurf', path: '.windsurf/rules/lovely-docs.md' },
		// 				{ label: 'Google Antigravity', value: 'antigravity', path: '.agent/rules/lovely-docs.md' },
		// 				{ label: 'Claude Code', value: 'claude', path: '.lovely-docs/CLAUDE.md' },
		// 				{ label: 'Gemini', value: 'gemini', path: '.lovely-docs/GEMINI.md' },
		// 				{ label: 'OpenCode', value: 'opencode', path: '.lovely-docs/AGENTS.md' }
		// 			];

		// 			const initialValues: string[] = [];
		// 			if (await fs.pathExists(join(process.cwd(), '.cursor'))) initialValues.push('cursor');
		// 			if (await fs.pathExists(join(process.cwd(), '.windsurf'))) initialValues.push('windsurf');
		// 			if (await fs.pathExists(join(process.cwd(), '.agent'))) initialValues.push('antigravity');
		// 			if (await fs.pathExists(join(process.cwd(), 'CLAUDE.md'))) initialValues.push('claude');
		// 			if (await fs.pathExists(join(process.cwd(), '.gemini'))) initialValues.push('gemini');
		// 			if (await fs.pathExists(join(process.cwd(), 'opencode.json'))) initialValues.push('opencode');

		// 			const selectedRules = await p.multiselect({
		// 				message: 'Generate AI Assistant Rules for:',
		// 				options: ruleTargets.map((t) => ({ value: t.value, label: t.label })),
		// 				initialValues: initialValues.length > 0 ? initialValues : undefined,
		// 				required: false
		// 			});

		// 			if (!p.isCancel(selectedRules)) {
		// 				const baseContent = `Documentation is located in ${installDir}. Start by reading LLM_MAP.md to locate relevant files. Prefer reading the .md digest files. Only read .full.md files if the digest is insufficient.`;

		// 				for (const val of selectedRules as string[]) {
		// 					const target = ruleTargets.find((t) => t.value === val);
		// 					if (target) {
		// 						const fullPath = join(process.cwd(), target.path);
		// 						let finalContent = baseContent;

		// 						if (val === 'cursor') {
		// 							finalContent = `---
		// alwaysApply: true
		// ---

		// ${baseContent}`;
		// 						} else if (val === 'antigravity' || val === 'windsurf') {
		// 							finalContent = `---
		// trigger: always_on
		// ---

		// ${baseContent}`;
		// 						} else if (val === 'gemini') {
		// 							finalContent = `## Lovely Docs\n${baseContent}`;
		// 							// Update .gemini/settings.json
		// 							const settingsPath = join(process.cwd(), '.gemini/settings.json');
		// 							try {
		// 								await fs.ensureDir(dirname(settingsPath));
		// 								let settings: any = {};
		// 								if (await fs.pathExists(settingsPath)) {
		// 									settings = await fs.readJson(settingsPath);
		// 								}
		// 								settings.context = settings.context || {};
		// 								settings.context.fileName = settings.context.fileName || ['GEMINI.md'];
		// 								if (Array.isArray(settings.context.fileName)) {
		// 									if (!settings.context.fileName.includes('.lovely-docs/GEMINI.md')) {
		// 										settings.context.fileName.push('.lovely-docs/GEMINI.md');
		// 									}
		// 								} else if (typeof settings.context.fileName === 'string') {
		// 									settings.context.fileName = [settings.context.fileName, '.lovely-docs/GEMINI.md'];
		// 								}
		// 								await fs.writeJson(settingsPath, settings, { spaces: 2 });
		// 								console.log(pc.green(`✓ Updated .gemini/settings.json`));
		// 							} catch (e) {
		// 								console.error(pc.yellow('Failed to update .gemini/settings.json'), e);
		// 							}
		// 						} else if (val === 'opencode') {
		// 							finalContent = `## Lovely Docs\n${baseContent}`;
		// 							// Update opencode.json
		// 							const configPath = join(process.cwd(), 'opencode.json');
		// 							try {
		// 								let config: any = {};
		// 								if (await fs.pathExists(configPath)) {
		// 									config = await fs.readJson(configPath);
		// 								}
		// 								config.instructions = config.instructions || [];
		// 								if (!config.instructions.includes('.lovely-docs/AGENTS.md')) {
		// 									config.instructions.push('.lovely-docs/AGENTS.md');
		// 								}
		// 								await fs.writeJson(configPath, config, { spaces: 2 });
		// 								console.log(pc.green(`✓ Updated opencode.json`));
		// 							} catch (e) {
		// 								console.error(pc.yellow('Failed to update opencode.json'), e);
		// 							}
		// 						} else {
		// 							// Claude
		// 							finalContent = `## Lovely Docs\n${baseContent}`;
		// 						}

		// 						await fs.ensureDir(dirname(fullPath));
		// 						await fs.writeFile(fullPath, finalContent);
		// 						console.log(pc.green(`✓ Updated ${target.path}`));
		// 					}
		// 				}
		// 			}
		// 		}

		p.outro(pc.green(`Initialized! Run ${pc.bold('npx lovely-docs add')} to install libraries.`));
	});
