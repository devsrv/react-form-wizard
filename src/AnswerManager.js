export default {
  questions: [],
  targetQuestion: null,

  from(questions, answers) {
    this.questions = questions;
    this.answers = answers;

    return this;
  },

  answerOf(id) {
    const index = this.questions.findIndex(
      (question) => String(question.id) === String(id)
    );

    if (index !== -1) {
      this.targetQuestion = this.questions[index];
    }

    return this;
  },

  has(answerId) {
    if (!this.targetQuestion) return false;
    if (!this.answers.has(this.targetQuestion.id)) return false;

    const answer = this.answers.get(this.targetQuestion.id);

    return answer.includes(answerId);
  }
};
