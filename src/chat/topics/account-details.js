import AbstractTopic from './abstract-topic';
import AuthenticationTopic from './authenticate';

let FuzzySet = require('fuzzyset.js');

export default class AccountDetailsTopic extends AbstractTopic {
    constructor(container, user) {
        super('account-details', container, user);

        this.authTarget = 0.5;
    }

    notify(lastTopic) {
        this.container.shift();
        return "Thank you for that. Your address on file is " + this.user.address + ". " + this.container[this.container.length - 1].notify(this);
    }

    handleInput(msg) {
        if (this.user.authLevel < this.authTarget) {
            let auth = new AuthenticationTopic(this.container, this.user);
            this.container.push(auth);
            return auth.handleInput("I can definitely help you with that but before I do, I need to get to know you better.");
        }

        this.container.shift();
        return '{"message":"Your address on file is ' + this.user.address + '. ' + this.container[0].notify(this) + '", "context":"welcome"}';
    }
}