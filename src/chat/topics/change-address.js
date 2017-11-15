import AbstractTopic from './abstract-topic';
import AuthenticationTopic from './authenticate';

export default class ChangeAddressTopic extends AbstractTopic {
    constructor(container, user) {
        super('changeAddress', container, user);
        this.states.push('awaitingNew');
        this.authTarget = 5.0;
    }

    notify(lastTopic) {
        this.state = 'awaitingNew';
        return "Thank you for that. What would you like your new address to be?";
    }

    handleInput(msg) {
        if (this.user.authLevel < this.authTarget) {
            let auth = new AuthenticationTopic(this.container, this.user);
            this.container.unshift(auth);
            return '{"message":"I can definitely help you with that but before I do, I need to get to know you better. "' + auth.getQuestion() + '", "context": "welcome"}';
        } else if (state === 'awaitingNew') {
            this.user.address(msg.raw);
            this.container.shift();
            return '{"message":"Your new address is: ' + this.user.address + '. ' + this.container[0].notify(this) + '", "context": "welcome"}';
        }

        this.state = 'awaitingNew';
        return '{"message":"What would you like your new address to be?", "context":"welcome"}';
    }
}