import {execSync} from 'child_process';
import {CommandType} from '../types/index.js';

export interface CommandAvailability {
	claude: boolean;
	codex: boolean;
	available: CommandType[];
}

/**
 * Check if a command is available in the system PATH
 */
function isCommandAvailable(command: string): boolean {
	try {
		// Try to get the command location using 'which' on Unix or 'where' on Windows
		const checkCommand = process.platform === 'win32' ? 'where' : 'which';
		execSync(`${checkCommand} ${command}`, {
			stdio: 'ignore',
			timeout: 5000, // 5 second timeout
		});
		return true;
	} catch {
		return false;
	}
}

/**
 * Check availability of AI coding commands
 */
export function checkCommandAvailability(): CommandAvailability {
	const claude = isCommandAvailable('claude');
	const codex = isCommandAvailable('codex');

	const available: CommandType[] = [];
	if (claude) available.push('claude');
	if (codex) available.push('codex');

	return {
		claude,
		codex,
		available,
	};
}

/**
 * Get the appropriate command type based on availability
 * Returns null if no commands are available
 */
export function getDefaultCommandType(
	availability: CommandAvailability,
): CommandType | null {
	if (availability.available.length === 0) {
		return null;
	}

	// If both are available, prefer Claude
	if (availability.claude) {
		return 'claude';
	}

	// Otherwise return the only available one
	return availability.available[0] || null;
}

/**
 * Check if command selection UI should be shown
 */
export function shouldShowCommandSelection(
	availability: CommandAvailability,
): boolean {
	return availability.available.length > 1;
} 