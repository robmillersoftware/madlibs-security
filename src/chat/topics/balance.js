import AbstractTopic from './abstract-topic';
import AuthenticationTopic from './authenticate';
const accounts = require('../../api/accounts.json');

export default class BalanceTopic extends AbstractTopic {
    constructor(container, user) {
        super('balance', container, user);

        this.authTarget = 0.0;
    }

    notify(lastTopic) {
        this.container.shift();
        const acctBalance = accounts.content[0].balance;
        return "Thank you for that. Your balance is "+acctBalance+" you broke bastard! " + this.container[0].notify(this);
    }

    handleInput(msg) {
        if (this.user.authLevel < this.authTarget) {
            let auth = new AuthenticationTopic(this.container, this.user);
            this.container.unshift(auth);
            return auth.handleInput("I can definitely help you with that but before I do, I need to get to know you better.");
        }

        this.container.shift();
        return '{"message":"Your balance is $0 you broke bastard! ' + this.container[0].notify(this) + '", "context":"welcome"}';
    }
}