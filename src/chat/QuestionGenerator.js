const questions = require('../api/questions.json');

let qArray = JSON.parse(questions);

export default class QuestionGenerator {
	//constructor() {
		//this.questions = JSON.parse(questions);
	//}

	static generateQuestion() {
		const questionNumber = QuestionGenerator.getRandomNumber(0, qArray.length);

		const question = qArray[questionNumber];

		qArray.splice(questionNumber, 1);

		return question;
	}

	static getRandomNumber(min, max) {
	  return Math.floor(Math.random() * (max - min + 1)) + min;
	}
}