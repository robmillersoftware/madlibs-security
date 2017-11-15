import AbstractTopic from './abstract-topic';
import AuthenticationTopic from './authenticate';

export default class PayOthersTopic extends AbstractTopic {
    constructor(container, user) {
        super('pay-other', container,user);

        this.authTarget = 3.0;

        this.states.push('getAmt');
        this.states.push('getPayee');
        this.states.push('getRouting');
        this.states.push('getAcct');
        this.states.push('confirm');

        this.amt = null;
        this.payee = null;
    }

    notify(lastTopic) {
        this.state = 'getAmt';
        return "How much would you like to transfer?";
    }

    handleInput(msg) {
        if (this.user.authLevel < this.authTarget) {
            let auth = new AuthenticationTopic(this.container, this.user);
            this.container.unshift(auth);
            return auth.handleInput("Let me get that set up for you.");
        } else if (this.state === 'getAmt') {
            this.amt = msg.raw;
            this.state = 'getPayee';
            return '{"message":"Who would you like to transfer money to?", "context":"welcome"}';
        } else if (this.state === 'getPayee') {
            this.payee = msg.raw;
            this.state = 'confirm';
            return '{"message":"Are you sure you want to send ' + this.amt + ' to ' + this.payee + '?", "context":"welcome"}';
        } else if (this.state === 'confirm') {
            if (msg.raw.contains('yes')) {
                this.container.shift();
                return '{"message":"Thank you, transferring funds. ' + this.container[0].notify(this) + '", "context":"welcome"}';
            } else {
                this.container.shift();
                return '{"message":"' + this.container[0].notify(this) + '", "context":"welcome"}';
            }
        }
    }
}