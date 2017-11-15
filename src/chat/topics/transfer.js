import AbstractTopic from './abstract-topic';
import AuthenticationTopic from './authenticate';

export default class TransferTopic extends AbstractTopic {
    constructor(container,user) {
        super('transfer', container, user);

        this.states.push('getSrc');
        this.authTarget = 2.0;
    }

    notify(lastTopic) {
        this.state = 'getSrc';
        return "Thank you for that. We're ready to transfer money. Which account would you like to transfer from?";
    }

    handleInput(msg) {
        if (this.user.authLevel < this.authTarget) {
            let auth = new AuthenticationTopic(this.container, this.user);
            this.container.unshift(auth);
            return auth.handleInput("I can definitely help you with that but before I do, I need to get to know you better.");
        } else if (this.state === 'getDest') {
            this.container.shift();
            return '{"message":"Ok, lets transfer money. ' + this.container[0].notify(this) + '", "context": "welcome"}';
        }

        this.state = 'getDest';
        return '{"message":"Which account would you like to transfer from?", "context":"welcome"}';
    }
}