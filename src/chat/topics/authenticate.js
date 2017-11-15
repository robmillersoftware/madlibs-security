import AbstractTopic from './abstract-topic';
import QuestionGenerator from '../QuestionGenerator';

let FuzzySet = require('fuzzyset.js');

export default class AuthenticateTopic extends AbstractTopic {
    constructor(container, user) {
        super('authenticate', container, user);
        this.authTarget = container[0].authTarget;
        this.currentQuestion = null;
        this.currentAnswer = null;
    }

    getQuestion() {
        let qa = QuestionGenerator.generateQuestion();
        this.currentQuestion = qa.question;
        this.currentAnswer = FuzzySet([qa.answer]);
    }

    adjustTrustLevel(message) {
        let result = this.currentAnswer.get(message.raw);
        console.log(result);
        if (result[0] > 0.5) {
            this.user.authLevel += 0.5;
        } else {
            this.user.authLevel -= 0.5;
        }

        this.getQuestion();
    }

    handleInput(msg) {
        if (this.currentQuestion) {
            this.adjustTrustLevel(msg);
        } else {
            this.getQuestion();
            return '{"message": "' + msg + ' ' + this.currentQuestion + '", "context": "welcome"}';
        }

        if (this.user.authLevel >= this.authTarget) {
            this.container.shift();
            return '{"message":"' + this.container[0].notify(this) + '", "context":"welcome"}';
        }
   
        return '{"message":"' + this.currentQuestion + '", "context": "welcome"}';
    }
}