import { field, checkboxType } from '../Fixed';
import { EXTENDER_favoriteSport, EXTENDER_games } from './Extenders';
import { DEADBLOCK_likeGames } from './Deadblocks';

export default [
	{
		id: 1,
		title: 'What is your super power',
		type: field.RADIO,
		options: [
			{ id: 1, value: 1, title: 'Being Human' },
			{ id: 2, value: 2, title: 'My Mind' },
			{ id: 3, value: 3, title: 'Crafting Skill' },
			{ id: 4, value: 4, title: 'Sixth Sense' },
		],
		validate: (answers) => answers.length,
	},
	{
		id: 2,
		title: 'What is your favorite sport',
		type: field.CHECKBOX,
		options: [
			{ id: 1, value: 1, title: 'FootBall' },
			{ id: 2, value: 2, title: 'Cricket' },
			{ id: 3, value: 3, title: 'Tenis' },
			{ id: 4, value: 4, title: 'All of the above', type: checkboxType.ALL },
		],
		validate: (answers) => answers.length,
	},

	EXTENDER_favoriteSport,

	{
		id: 3,
		title: 'Do you like Computer Games',
		type: field.RADIO,
		options: [
			{ id: 1, value: 1, title: 'Yes' },
			{ id: 2, value: 2, title: 'No' },
		],
		validate: (answers) => answers.length,
	},

	DEADBLOCK_likeGames,
	EXTENDER_games,

	{
		id: 4,
		title: 'Write something fantastic about yourself',
		type: field.TEXTAREA,
		answerAttributes: { label: 'Write at least 100 words', placeholder: 'you can add links too' },
		options: [],
		validate: (answers) => answers.length && answers[0].trim().length >= 3,
	},
];
