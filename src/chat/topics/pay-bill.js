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
        return "Thank you for that. How much would you like to pay to Verizon?";
    }

    handleInput(msg) {
        if (this.user.authLevel < this.authTarget) {
            let auth = new AuthenticationTopic(this.container, this.user, this.id);
            this.container.unshift(auth);
            return auth.handleInput("Let me get that set up for you.");
        } else if (this.state === 'getPayee') {
            this.container.shift();
            this.user.acctBalance -= 68;
            return '{"message":"Paid $68 to Verizon. ' + this.container[0].notify(this) + '", "context":"welcome"}';
        } else {
            this.container.shift();
            return '{"message":"' + this.container[0].notify(this) + '", "context":"welcome"}';
        }
    }
}