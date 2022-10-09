import { field, checkboxType } from '../Fixed';

// lastAnswers [2, ...] | answerOf(qid).has() / first()
export const EXTENDER_favoriteSport = (answerOf, lastAnswers) => {
	let extendWith = [];

	const Q_FAV_SPORT = 2;
	const A_FOOTBALL = 1;

	const Q_FAV_FOOTBALLER = 'q2-1';
	const A_OTHER_FOOTBALLER = 3;

	const EXTENDER_favoriteFootballer = (answerOf, lastAnswers) => {
		if (answerOf(Q_FAV_FOOTBALLER).has(A_OTHER_FOOTBALLER)) {
			return [
				{
					id: 'q2-1-1',
					title: "Enter your fav. footballer's name",
					type: field.TEXT,
					answerAttributes: { label: 'From any club', placeholder: 'write the name in english' },
					options: [],
					validate: (answers) => answers.length && answers[0].trim().length >= 3,
				},
			];
		}

		return [];
	};

	if (answerOf(Q_FAV_SPORT).has(A_FOOTBALL)) {
		extendWith = [
			...extendWith,
			{
				id: 'q2-1',
				title: 'Who is your favorite FootBall player',
				type: field.CHECKBOX,
				options: [
					{ id: 1, value: 1, title: 'Messi' },
					{ id: 2, value: 2, title: 'CR7' },
					{ id: 3, value: A_OTHER_FOOTBALLER, title: 'Other', type: checkboxType.RESET },
				],
				validate: (answers) => answers.length,
			},

			EXTENDER_favoriteFootballer,
		];
	}

	return extendWith;
};

export const EXTENDER_games = (answerOf, lastAnswers) => {
	const Y = 1;

	if (lastAnswers.includes(Y)) {
		return [
			{
				id: 'q3-1',
				title: 'What game have you been playing recently ?',
				type: field.TEXT,
				answerAttributes: { label: 'Game', placeholder: 'pc or console game name' },
				options: [],
				validate: (answers) => answers.length && answers[0].trim().length >= 3,
			},
		];
	}

	return [];
};
