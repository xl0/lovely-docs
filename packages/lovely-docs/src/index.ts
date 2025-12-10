#!/usr/bin/env node
import { Command } from 'commander';
import { addCommand } from './commands/add.js';
import { initCommand } from './commands/init.js';
import { listCommand } from './commands/list.js';
import { removeCommand } from './commands/remove.js';
import { updateCommand } from './commands/update.js';

import { mcpCommand } from './commands/mcp.js';

import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const pkg = require('../package.json');
const version = pkg.version;

const program = new Command();

program.name('lovely-docs').description('CLI tool to add curated documentation to your project').version(version);

program.addCommand(initCommand);
program.addCommand(listCommand);
program.addCommand(addCommand);
program.addCommand(updateCommand);
program.addCommand(removeCommand);
program.addCommand(mcpCommand);

// Default action: Show help
program.action(() => {
	program.help();
});

program.parse(process.argv);
