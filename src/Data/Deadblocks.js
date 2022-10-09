export const DEADBLOCK_likeGames = (answerOf, lastAnswers) => {
	const N = 2;

	if (lastAnswers.includes(N)) {
		return { allow: false, message: 'Sorry this is for cyber pros only' };
	}

	return {
		allow: true,
	};
};
