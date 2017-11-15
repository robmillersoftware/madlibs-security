import AbstractTopic from './abstract-topic';
import AuthenticationTopic from './authenticate';

let FuzzySet = require('fuzzyset.js');

export default class BalanceTopic extends AbstractTopic {
    constructor(container, user) {
        super('balance', container, user);

        this.authTarget = 0.0;
    }

    notify(lastTopic) {
        this.container.shift();
        return "Thank you for that. Your balance is $" + this.user.acctBalance + "." + this.container[0].notify(this);
    }

    handleInput(msg) {
        if (this.user.authLevel < this.authTarget) {
            let auth = new AuthenticationTopic(this.container, this.user);
            this.container.unshift(auth);
            return auth.handleInput("I can definitely help you with that but before I do, I need to get to know you better.");
        }

        this.currentAnswer = FuzzySet([msg.raw]);
        let creditCardResult = this.currentAnswer.get('credit card');
        let savingsAccountResult = this.currentAnswer.get('savings account');
        if(creditCardResult && creditCardResult[0][0] > 0.3) {
            this.container.shift();
            return '{"message":"Your credit card balance is $' + this.user.creditAccountBalance + " " + this.container[0].notify(this) + '", "context":"welcome"}';
        } else if (savingsAccountResult && savingsAccountResult[0][0] > 0.3) {
            this.container.shift();
            return '{"message":"Your savings account balance is $' + this.user.savingsAccountBalance + " " + this.container[0].notify(this) + '", "context":"welcome"}';
        }

        this.container.shift();
        return '{"message":"Your balance is $' + this.user.acctBalance + " " + this.container[0].notify(this) + '", "context":"welcome"}';
    }
}