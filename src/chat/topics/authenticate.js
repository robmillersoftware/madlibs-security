import AbstractTopic from './abstract-topic';
import QuestionGenerator from '../QuestionGenerator';

export default class AuthenticateTopic extends AbstractTopic {
    constructor(container, user) {
        super('authenticate', container, user);
        this.authTarget = container[0].authTarget;
        this.currentQuestion = '';
        this.currentAnswer = '';
    }

    getQuestion() {
        let qa = QuestionGenerator.generateQuestion();
        this.currentQuestion = JSON.stringify(qa.question);
        this.currentAnswer = JSON.stringify(qa.answer);
    }

    adjustTrustLevel(message) {
        if (message.raw.contains(this.answer)) {
            this.user.authLevel += 0.5;
        } else {
            this.user.authLevel -= 0.5;
        }

        this.getQuestion();
    }

    handleInput(msg) {
        if (this.currentQuestion !== '') {
            this.adjustTrustLevel(msg);     
        }

        if (this.user.authLevel >= this.authTarget) {
            this.container.shift();
            return '{"message":"' + this.container[0].notify(this) + '", "context":"welcome"}';
        }
   
        return '{"message":"' + this.currentQuestion + '", "context": "welcome"}';
    }
}