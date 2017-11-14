import AbstractTopic from './abstract-topic';

export default class AuthenticateTopic extends AbstractTopic {
    constructor(container, user) {
        super('authenticate', container, user);
        this.authTarget = container[container.length - 1].authTarget;
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
        this.adjustTrustLevel(msg);

        if (this.user.authLevel >= this.authTarget) {
            this.container.pop();
            return '{"message":"' + this.container[this.container.length - 1].notify(this) + '", "context":"welcome"}';
        }

        return '{"message":"' + this.getQuestion() + '", "context": "auth"}';
    }
}