import AbstractTopic from './abstract-topic';
import AuthenticationTopic from './authenticate';

export default class AccountDetailsTopic extends AbstractTopic {
    constructor(container, user) {
        super('balance', container, user);

        this.authTarget = 0.5;
    }

    notify(lastTopic) {
        this.container.pop();
        return "Thank you for that. Blah blah details blah " + this.container[this.container.length - 1].notify(this);
    }

    handleInput(msg) {
        if (this.user.authLevel < this.authTarget) {
            let auth = new AuthenticationTopic(this.container, this.user);
            this.container.push(auth);
            return '{"message":"I can definitely help you with that but before I do, I need to get to know you better. "' + auth.getQuestion() + '", "context": "auth"}';
        }

        return '{"message":"Blah blah details blah", "context":"welcome"}';
    }
}