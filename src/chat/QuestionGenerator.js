let q = require('../api/questions.json');

export default class QuestionGenerator {
	//constructor() {
		//this.questions = JSON.parse(questions);
	//}

	static generateQuestion() {
		const questionNumber = Math.floor(Math.random() * q.questions.length);//QuestionGenerator.getRandomNumber(0, q.questions.length);
		const question = q.questions[questionNumber];

		q.questions.splice(questionNumber, 1);

		return question;
	}

	/*static getRandomNumber(min, max) {
	  return Math.floor(Math.random() * (max - min + 1)) + min;
	}*/
}