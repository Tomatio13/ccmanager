import React from 'react';
import {Box, Text, useInput} from 'ink';
import SelectInput from 'ink-select-input';
import {CommandType} from '../types/index.js';
import {shortcutManager} from '../services/shortcutManager.js';
import {CommandAvailability} from '../utils/commandChecker.js';

interface CommandSelectionProps {
	worktreeBranch: string;
	commandAvailability: CommandAvailability;
	onComplete: (commandType: CommandType) => void;
	onCancel: () => void;
}

interface CommandOption {
	label: string;
	value: CommandType;
}

const CommandSelection: React.FC<CommandSelectionProps> = ({
	worktreeBranch,
	commandAvailability,
	onComplete,
	onCancel,
}) => {
	// Build options based on available commands
	const options: CommandOption[] = [];

	if (commandAvailability.claude) {
		options.push({
			label: '[C] Claude Code - Advanced AI coding assistant',
			value: 'claude',
		});
	}

	if (commandAvailability.codex) {
		options.push({
			label: '[X] Codex - Fast AI code completion',
			value: 'codex',
		});
	}

	useInput((input, key) => {
		if (shortcutManager.matchesShortcut('cancel', input, key)) {
			onCancel();
		}
	});

	const handleSelect = (option: CommandOption) => {
		onComplete(option.value);
	};

	return (
		<Box flexDirection="column">
			<Box marginBottom={1}>
				<Text bold color="green">
					Select Command for Session
				</Text>
			</Box>

			<Box marginBottom={1}>
				<Text>
					Choose which AI assistant to use for worktree:{' '}
					<Text color="cyan">{worktreeBranch}</Text>
				</Text>
			</Box>

			<SelectInput items={options} onSelect={handleSelect} isFocused={true} />

			<Box marginTop={1}>
				<Text dimColor>
					Controls: ↑↓ Navigate, Enter Select,{' '}
					{shortcutManager.getShortcutDisplay('cancel')} Cancel
				</Text>
			</Box>
		</Box>
	);
};

export default CommandSelection; 