import { existsSync } from 'fs';
import fs from 'fs-extra';
import { readFile } from 'fs/promises';
import { join } from 'path';

interface IndexNode {
	displayName: string;
	origPath: string;
	children: Record<string, IndexNode>;
	relevant: boolean;
}

interface IndexJson {
	name: string;
	map: IndexNode;
}

export class Installer {
	constructor(
		private docDbPath: string,
		private targetDir: string
	) {}

	async install(
		libraryName: string,
		installs: 'digest' | 'fulltext' | 'both' = 'both',
		includeSummaries: boolean = false,
		includeLlmMap: boolean = true
	): Promise<void> {
		const libPath = join(this.docDbPath, libraryName);
		const indexPath = join(libPath, 'index.json');

		if (!existsSync(indexPath)) {
			throw new Error(`Library ${libraryName} not found in ${this.docDbPath}`);
		}

		const indexContent = await readFile(indexPath, 'utf-8');
		const index: IndexJson = JSON.parse(indexContent);

		const libTargetDir = join(this.targetDir, libraryName);
		await fs.ensureDir(libTargetDir);

		// 1. Copy Library Level Files
		if (includeSummaries) {
			let digestName = `${libraryName}.md`;
			let fulltextName = `${libraryName}.orig.md`;

			if (installs === 'fulltext') {
				fulltextName = `${libraryName}.md`;
			}

			if (installs === 'digest' || installs === 'both') {
				await this.copyVariant(libPath, join(this.targetDir, digestName), 'digest');
			}
			if (installs === 'fulltext' || installs === 'both') {
				await this.copyVariant(libPath, join(this.targetDir, fulltextName), 'fulltext');
			}

			await this.copyVariant(libPath, join(this.targetDir, `${libraryName}.summary.md`), 'short_digest');
		}

		// 2. Generate LLM_MAP.md
		if (includeLlmMap) {
			const essenceTree = await this.buildEssenceTree(libPath, index.map, '', index.name);
			const llmMapContent = this.renderEssenceTree(essenceTree, libTargetDir);
			await fs.outputFile(join(libTargetDir, 'LLM_MAP.md'), llmMapContent);
		}

		// 3. Traverse and copy children
		await this.processNode(libPath, libTargetDir, index.map, '', installs, includeSummaries);
	}

	private async copyVariant(sourceDir: string, targetPath: string, variant: 'digest' | 'fulltext' | 'short_digest') {
		const sourceFile = join(sourceDir, `${variant}.md`);
		if (existsSync(sourceFile)) {
			await fs.copy(sourceFile, targetPath);
		}
	}

	private async processNode(
		sourcePath: string,
		targetPath: string,
		node: IndexNode,
		relativePath: string,
		installs: 'digest' | 'fulltext' | 'both',
		includeSummaries: boolean
	) {
		// Process children
		for (const [key, child] of Object.entries(node.children)) {
			const childSourcePath = join(sourcePath, key);
			const childRelativePath = relativePath ? `${relativePath}/${key}` : key;

			let digestName = `${key}.md`;
			let fulltextName = `${key}.orig.md`;

			if (installs === 'fulltext') {
				fulltextName = `${key}.md`;
			}

			const childTargetFile = join(targetPath, digestName);
			const childTargetFullFile = join(targetPath, fulltextName);
			const childTargetDir = join(targetPath, key);

			const isDirectory = Object.keys(child.children).length > 0;
			const shouldInstallContent = child.relevant && (!isDirectory || includeSummaries);

			// Copy files
			if (shouldInstallContent) {
				if (installs === 'digest' || installs === 'both') {
					await this.copyVariant(childSourcePath, childTargetFile, 'digest');
				}
				if (installs === 'fulltext' || installs === 'both') {
					await this.copyVariant(childSourcePath, childTargetFullFile, 'fulltext');
				}
			}

			if (includeSummaries && child.relevant) {
				await this.copyVariant(childSourcePath, join(targetPath, `${key}.summary.md`), 'short_digest');
			}

			// Recurse if there are children
			if (isDirectory) {
				await fs.ensureDir(childTargetDir);
				await this.processNode(childSourcePath, childTargetDir, child, childRelativePath, installs, includeSummaries);
			}
		}
	}

	private async buildEssenceTree(path: string, node: IndexNode, relativePath: string, libraryName?: string): Promise<EssenceNode> {
		let essence = '';
		const essencePath = join(path, 'essence.md');
		if (existsSync(essencePath)) {
			essence = await readFile(essencePath, 'utf-8');
		}

		const children: Record<string, EssenceNode> = {};
		for (const [key, child] of Object.entries(node.children)) {
			const childRelativePath = relativePath ? `${relativePath}/${key}` : key;
			children[key] = await this.buildEssenceTree(join(path, key), child, childRelativePath);
		}

		return {
			name: libraryName || node.displayName,
			essence,
			children,
			relativePath
		};
	}

	private renderEssenceTree(node: EssenceNode, baseDir: string, depth = 0): string {
		let output = '';
		const indent = '  '.repeat(depth);

		if (depth === 0) {
			output += `# ${node.name}\n\n`;
			if (node.essence) output += `${node.essence}\n\n`;
		} else {
			const mdPath = node.relativePath ? `./${node.relativePath}.md` : './root.md';
			const essence = node.essence.trim().replace(/\n/g, ' ');
			output += `${indent}${mdPath}: ${essence}\n`;
		}

		for (const child of Object.values(node.children)) {
			output += this.renderEssenceTree(child, baseDir, depth + 1);
		}

		return output;
	}
}

interface EssenceNode {
	name: string;
	essence: string;
	children: Record<string, EssenceNode>;
	relativePath: string;
}
