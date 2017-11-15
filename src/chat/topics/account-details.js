import AbstractTopic from './abstract-topic';
import AuthenticationTopic from './authenticate';

export default class AccountDetailsTopic extends AbstractTopic {
    constructor(container, user) {
        super('balance', container, user);

        this.authTarget = 0.5;
    }

    notify(lastTopic) {
        this.container.shift();
        return "Thank you for that. Blah blah details blah " + this.container[this.container.length - 1].notify(this);
    }

    handleInput(msg) {
        if (this.user.authLevel < this.authTarget) {
            let auth = new AuthenticationTopic(this.container, this.user);
            this.container.push(auth);
            return auth.handleInput("I can definitely help you with that but before I do, I need to get to know you better.");
        }

        this.container.shift();
        return '{"message":"Blah blah details blah ' + this.container[0].notify(this) + '", "context":"welcome"}';
    }
}