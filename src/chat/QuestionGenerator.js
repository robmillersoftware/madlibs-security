let questions = require('../api/questions.json');

export default class QuestionGenerator {
	//constructor() {
		//this.questions = JSON.parse(questions);
	//}

	static generateQuestion() {
		const questionNumber = QuestionGenerator.getRandomNumber(0, questions.length);
		const question = questions[questionNumber];

		questions.splice(questionNumber, 1);

		return question;
	}

	static getRandomNumber(min, max) {
	  return Math.floor(Math.random() * (max - min + 1)) + min;
	}
}