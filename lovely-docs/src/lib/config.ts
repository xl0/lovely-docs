import { readFile, writeFile } from 'fs/promises';
import { join } from 'path';
import * as v from 'valibot';
import { parse, stringify } from 'yaml';

const ConfigSchema = v.object({
	source: v.variant('type', [
		v.object({
			type: v.literal('local'),
			docDir: v.string()
		}),
		v.object({
			type: v.literal('git'),
			repo: v.string(),
			branch: v.string(),
			gitCacheDir: v.string()
		})
	]),
	ecosystems: v.optional(v.array(v.string())),
	installed: v.array(v.string()),
	installDir: v.optional(v.string(), '.lovely-docs')
});

export type Config = v.Output<typeof ConfigSchema>;

const CONFIG_FILE = '.lovely-docs.yaml';

export class ConfigManager {
	private configPath: string;

	constructor(cwd: string = process.cwd()) {
		this.configPath = join(cwd, CONFIG_FILE);
	}

	async load(): Promise<Config | null> {
		try {
			const content = await readFile(this.configPath, 'utf-8');
			const data = parse(content);
			return v.parse(ConfigSchema, data);
		} catch (e) {
			return null;
		}
	}

	async save(config: Config): Promise<void> {
		const content = stringify(config);
		await writeFile(this.configPath, content, 'utf-8');
	}
}
