import { simpleGit } from 'simple-git';
import { existsSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { homedir } from 'os';
import pc from 'picocolors';

export function getCacheDir(): string {
	if (process.platform === 'win32') {
		return process.env.LOCALAPPDATA || join(homedir(), 'AppData', 'Local');
	}
	if (process.platform === 'darwin') {
		return join(homedir(), 'Library', 'Caches');
	}
	return process.env.XDG_CACHE_HOME || join(homedir(), '.cache');
}

export function getRepoPath(cacheDir: string, repoUrl: string): string {
	try {
		const url = new URL(repoUrl);
		const hostname = url.hostname;
		const pathname = url.pathname.replace(/^\//, '').replace(/\.git$/, '');
		return join(cacheDir, hostname, pathname);
	} catch (e) {
		return join(cacheDir, 'default');
	}
}

export function getDocDbPath(repoPath: string): string {
	return join(repoPath, 'doc_db');
}

export class DocRepo {
	private repoPath: string;

	constructor(repoPath: string) {
		this.repoPath = repoPath;
	}

	async sync(repoUrl: string, branch: string): Promise<string> {
		const git = simpleGit();

		if (!existsSync(this.repoPath)) {
			console.log(pc.blue(`Cloning ${repoUrl} to ${this.repoPath}`));
			try {
				mkdirSync(dirname(this.repoPath), { recursive: true });
				await git.clone(repoUrl, this.repoPath, ['-b', branch]);
			} catch (e) {
				const msg = e instanceof Error ? e.message : String(e);
				console.error(pc.red('Failed to clone git repo:'), msg);
				process.exit(1);
			}
		} else {
			console.log(pc.blue(`Syncing ${repoUrl} -> ${this.repoPath}`));
			try {
				if (!existsSync(join(this.repoPath, '.git'))) {
					throw new Error('Directory exists but is not a git repository');
				}
				const repo = simpleGit(this.repoPath);

				await repo.fetch(['origin', branch]);
				await repo.reset(['--hard', `origin/${branch}`]);
			} catch (e) {
				const msg = e instanceof Error ? e.message : String(e);
				console.error(pc.red('Failed to sync git repo:'), msg);
				process.exit(1);
			}
		}

		return join(this.repoPath, 'doc_db');
	}
}
