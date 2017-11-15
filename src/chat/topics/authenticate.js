import AbstractTopic from './abstract-topic';
import QuestionGenerator from '../QuestionGenerator';

let FuzzySet = require('fuzzyset.js');

export default class AuthenticateTopic extends AbstractTopic {
    constructor(container, user, parentTopic) {
        super('authenticate', container, user);
        this.authTarget = container[0].authTarget;
        this.strikes = 0;
        this.currentQuestion = null;
        this.currentAnswer = null;
        this.parentTopic = parentTopic;
    }

    getQuestion() {
        let qa = null;

        if(this.parentTopic === 'pay-bill') {
            qa = QuestionGenerator.generateBillQuestion();
        } else {
            qa = QuestionGenerator.generateQuestion();
        }

        this.currentQuestion = qa.question;
        this.currentAnswer = FuzzySet([qa.answer]);
    }

    adjustTrustLevel(message) {
        let result = this.currentAnswer.get('' + message.raw);
        if (result && result[0][0] > 0.5) {
            this.user.authLevel += 0.5;
            this.strikes = 0;
        } else {
            if (this.parentTopic === 'pay-bill') {

            }
            this.strikes += 1;
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
   
        if(this.strikes < 3 && this.user.authLevel > -1) {
            if (this.strikes === 1 && this.parentTopic === 'pay-bill') {
                this.container.shift();
                this.container.shift();
                return '{"message": "I\'m sorry. We don\'t have that bill on file. ' + this.container[0].notify(this) + '", "context":"welcome"}';
            }
            return '{"message":"' + this.currentQuestion + '", "context": "welcome"}';  
        } else {
            this.container.shift();
            return '{"message": "We cannot authenticate you at this time. We are connecting you with the PNC Care Center.", "context": "rejected"}'; 
        }
    }
}