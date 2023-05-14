import child_process from 'child_process';
import jest from '@jest/globals';

function cli(command: string): Promise<number> {
	return new Promise((resolve) => {
		child_process.exec(`node dist/ensu.js ${command}`, (error) => {
			resolve(error?.code || 0);
		});
	});
}

jest.describe('test cli commands', () => {
	jest.test('if command', async () => {
		await jest.expect(cli('if NODE_ENV test')).resolves.toBe(0);
		await jest.expect(cli('if NODE_ENV')).resolves.toBe(0);
		await jest.expect(cli('if BEST_ANIMAL -s')).resolves.toBe(1);
		await jest.expect(cli('if BEST_ANIMAL cats -f tests/.env')).resolves.toBe(0);
		await jest.expect(cli('if BEST_ANIMAL dogs -f tests/.env')).resolves.toBe(1);
		await jest.expect(cli('if BEST_ANIMAL cats -f tests/.env -s')).resolves.toBe(1);
	});

	jest.test('switch command', async () => {
		await jest.expect(cli('ensu switch')).resolves.toBe(1);
	});
});
