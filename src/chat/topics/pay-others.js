import AbstractTopic from './abstract-topic';
import AuthenticationTopic from './authenticate';

export default class PayOthersTopic extends AbstractTopic {
    constructor(container, user) {
        super('pay-other', container,user);

        this.authTarget = 1.5;

        this.states.push('getPayee');
        this.states.push('paid');
    }

    notify(lastTopic) {
        this.state = 'getPayee';
        return "Thank you for that. Who would you like to pay?";
    }

    handleInput(msg) {
        if (this.user.authLevel < this.authTarget) {
            let auth = new AuthenticationTopic(this.container, this.user);
            this.container.unshift(auth);
            return auth.handleInput("I can definitely help you with that but before I do, I need to get to know you better.");
        } else if (this.state === 'getPayee') {
            this.container.shift();
            return '{"message":"Trying to pay or something. ' + this.container[0].notify(this) + '", "context":"welcome"}';
        } else {
            this.state = 'getPayee';
            return '{"message":"Who would you like to pay?", "context":"welcome"}';
        }
    }
}