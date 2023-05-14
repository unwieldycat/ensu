#!/usr/bin/env node

// ================================= Import ================================= //

import { execSync } from 'child_process';
import { Command } from 'commander';
import path from 'path';
import fs from 'fs';

// ============================ Init & Functions ============================ //

export async function loadDotenv(envPath?: string): Promise<void> {
	const cwd = process.cwd();

	for (const filePath of module.paths) {
		if (!fs.existsSync(filePath + path.sep + 'dotenv')) continue;
		const envFile = envPath ? path.resolve(cwd, envPath) : path.resolve(cwd, '.env');
		if (!fs.existsSync(envFile)) continue;
		const dotenv = await import('dotenv');
		const dotenvOut = dotenv.config({ path: envFile });
		if (dotenvOut.error) throw dotenvOut.error;
		return;
	}
}

const program = new Command().version('2.0.0');

// =============================== If Command =============================== //

program
	.command('if <variable> [value]')
	.description('if command')
	.option('-s, --skip-dotenv', 'skip .env file check')
	.option('-f, --env-file <path>', 'relative path to .env file')
	.action(async (variable, value, options) => {
		if (!options.skipDotenv) options.envFile ? await loadDotenv(options.envFile) : await loadDotenv();

		if (!process.env[variable]) {
			if (console) console.log(`✘ ${variable} does not exist, exiting with code 1...`);
			process.exit(1);
		}

		if (!value) {
			console.log(`✔ ${variable} exists, exiting with code 0...`);
			process.exit(0);
		}

		if (process.env[variable] !== value) {
			if (console) console.log(`✘ ${variable} is not set to ${value}, exiting with code 1...`);
			process.exit(1);
		}

		console.log(`✔ ${variable} is set to ${value}, exiting with code 0...`);
		process.exit(0);
	});

// ============================= Switch Command ============================= //

program
	.command('switch')
	.description('switch command for package.json')
	.option('-e, --env-var <variable>', 'target environment variable', 'NODE_ENV')
	.option('-s, --skip-dotenv', 'skip .env file check')
	.option('-y, --yarn', 'run with yarn instead of npm')
	.option('-p, --sep <string>', 'case-command seperator', ':')
	.option('-f, --env-file <path>', 'relative path to .env file')
	.action(async (options) => {
		if (!options.skipDotenv) options.envFile ? await loadDotenv(options.envFile) : await loadDotenv();

		const cwd = process.cwd();
		const pkg = await import(cwd + path.sep + 'package.json');
		const sep = options.sep || ':';

		const event = process.env.npm_lifecycle_event;
		const targetScript = pkg.scripts[`${event}${sep}${process.env[options.envVar]}`];
		const manager = options.yarn ? 'yarn' : 'npm';

		if (!targetScript && console) {
			console.log('✘ Script does not exist, exiting with code 1...');
			process.exit(1);
		}

		console.log(`✔ Running ${process.env[options.envVar]} (${event}) script`);
		execSync(`${manager} run ${event}${sep}${process.env[options.envVar]}`, {
			stdio: 'inherit'
		});
	});

// ============================== Parse Input ============================== //

program.parseAsync(process.argv).catch((err) => {
	throw err;
});
