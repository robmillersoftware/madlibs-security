import AbstractTopic from './abstract-topic';
import QuestionGenerator from '../QuestionGenerator';

export default class AuthenticateTopic extends AbstractTopic {
    constructor(container, user) {
        super('authenticate', container, user);
        this.authTarget = container[0].authTarget;
        this.currentQuestion = '';
        this.currentAnswer = '';
        this.strikes = 0;
    }

    getQuestion() {
        let qa = QuestionGenerator.generateQuestion();
        this.currentQuestion = qa.question;
        this.currentAnswer = qa.answer;

        console.log(this.currentQuestion + ' ' + this.currentAnswer);
    }

    adjustTrustLevel(message) {
        if (message.raw.contains(this.currentAnswer)) {
            this.user.authLevel += 0.5;
            this.strikes = 0;
        } else {
            this.strikes += 1;
            this.user.authLevel -= 0.5;
        }

        this.getQuestion();
    }

    handleInput(msg) {
        if (this.currentQuestion !== '') {
            this.adjustTrustLevel(msg);     
        } else {
            this.getQuestion();
        }

        if (this.user.authLevel >= this.authTarget) {
            this.container.shift();
            return '{"message":"' + this.container[0].notify(this) + '", "context":"welcome"}';
        }
   
        if(this.strikes < 3 && this.user.authLevel > -1) {
            return '{"message":"' + this.currentQuestion + '", "context": "welcome"}';
        } else {
            return '{"message": "We cannot authenticate you at this time. We are connecting you with the PNC Care Center.", "context": "rejected"}'; 
        }
    }
}