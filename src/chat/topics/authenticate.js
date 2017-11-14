import AbstractTopic from './abstract-topic';

export default class AuthenticateTopic extends AbstractTopic {
    constructor(container, user) {
        super('authenticate', container, user);
        this.authTarget = container[0].authTarget;
        this.currentQuestion = '';
    }

    getQuestion() {
        this.currentQuestion = "How much wood could a woodchuck chuck if a woodchuck could chuck wood?";
        return this.currentQuestion;
    }

    adjustTrustLevel(message) {
        this.user.authLevel = this.authTarget;
    }

    handleInput(msg) {
        if (this.user.authLevel >= this.authTarget) {
            this.container.shift();
            return '{"message":"' + this.container[0].notify(this) + '", "context":"welcome"}';
        }

        this.adjustTrustLevel(msg);
        
        return '{"message":"' + msg + ' ' + this.getQuestion() + '", "context": "auth"}';
    }
}