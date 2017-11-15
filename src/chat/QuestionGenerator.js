const questions = require('../api/questions.json');

export default class QuestionGenerator {
	constructor() {
		this.questions = JSON.parse(questions);
	}

	generateQuestion() {
		const questionNumber = this.getRandomNumber(0, this.questions.length);

		const question = this.questions[questionNumber];

		this.questions.splice(questionNumber, 1);

		return question;
	}

	getRandomNumber(min, max) {
	  return Math.floor(Math.random() * (max - min + 1)) + min;
	}
}