import AbstractTopic from './abstract-topic';
import AuthenticationTopic from './authenticate';

export default class SetupBillerTopic extends AbstractTopic {
    constructor(container, user) {
        super('setup-biller', container,user);

        this.authTarget = 1.5;
    }

    notify(lastTopic) {
        this.container.shift();
        return "Thank you for that. Do something? " + this.container[0].notify(this);
    }

    handleInput(msg) {
        if (this.user.authLevel < this.authTarget) {
            let auth = new AuthenticationTopic(this.container, this.user);
            this.container.unshift(auth);
            return auth.handleInput("I can definitely help you with that but before I do, I need to get to know you better.");
        } 
            
        this.container.shift();
        return '{"message":"Do something? ' + this.container[0].notify(this) + '", "context":"welcome"}';
    }
}