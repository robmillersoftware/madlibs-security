import AbstractTopic from './abstract-topic';
import AuthenticationTopic from './authenticate';

export default class BillsTopic extends AbstractTopic {
    constructor(container, user) {
        super('bills', container,user);

        this.authTarget = 1.5;

        this.states.push('getPayee');
        this.states.push('paid');
    }

    notify(lastTopic) {
        this.state = 'getPayee';
        return "Thank you for that. We're ready to pay some bills. Which bill would you like to pay?";
    }

    handleInput(msg) {
        if (this.user.authLevel < this.authTarget) {
            let auth = new AuthenticationTopic(this.container, this.user);
            this.container.push(auth);
            return auth.handleInput("I can definitely help you with that but before I do, I need to get to know you better.");
        } else if (this.state === 'getPayee') {
            //TODO: Handle making a payment
        }

        return '{"message":"Echoing: ' + msg.raw + ' from BillsTopic", "context":"welcome"}';
    }
}