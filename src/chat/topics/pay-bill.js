import AbstractTopic from './abstract-topic';
import AuthenticationTopic from './authenticate';

export default class PayBillTopic extends AbstractTopic {
    constructor(container, user) {
        super('pay-bill', container,user);

        this.authTarget = 0.5;

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
            this.container.unshift(auth);
            return auth.handleInput("I can definitely help you with that but before I do, I need to get to know you better.");
        } else if (this.state === 'getPayee') {
            return '{"message":"Trying to pay or something.", "context":"welcome"}';
        } else {
            this.state = 'getPayee';
            return '{"message":"Which bill would you like to pay?", "context":"welcome"}';
        }
    }
}