import AbstractTopic from './abstract-topic';
import AuthenticationTopic from './authenticate';

export default class TransferTopic extends AbstractTopic {
    constructor(container,user) {
        super('transfer', container, user);

        this.states.push('getSrc');
        this.states.push('getDest');
        this.states.push('getAmt');
        this.states.push('confirm');

        this.authTarget = 2.0;

        this.src = null;
        this.dest = null;
        this.amt = null;
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
        } else if (this.state === 'getSrc') {
            this.src = msg.raw;
            this.state = 'getDest';
            return '{"message":"And which account would you like to transfer to?", "context":"welcome"}';
        } else if (this.state === 'getDest') {
            this.dest = msg.raw;
            this.state = 'getAmt';
            return '{"message":"How much would you like to transfer?", "context":"welcome"}';
        } else if (this.state === 'getAmt') {
            this.amt = msg.raw;
            this.state = 'confirm';
            return '{"message":"Just to confirm, you want to transfer ' + this.amt + ' from ' + this.src + ' to ' + this.dest + '. Is this correct?", "context":"welcome"}';
        } else {
            if (msg.raw.includes('yes')) {
                this.container.shift();
                return '{"message":"Your funds have been transferred. ' + this.container[0].notify(this) + '", "context":"welcome"}';
            } else {
                this.container.shift();
                return '{"message": "' +this.container[0].notify(this) + '", "context":"welcome"}';
            }
        }
    }
}