import AbstractTopic from './abstract-topic';
import AuthenticationTopic from './authenticate';

export default class SetupBillerTopic extends AbstractTopic {
    constructor(container, user) {
        super('setup-biller', container,user);

        this.authTarget = 1.5;
    }

    notify(lastTopic) {
        return "Thank you for that. Do something?";
    }

    handleInput(msg) {
        if (this.user.authLevel < this.authTarget) {
            let auth = new AuthenticationTopic(this.container, this.user);
            this.container.push(auth);
            return auth.handleInput("I can definitely help you with that but before I do, I need to get to know you better.");
        } 
            
        return '{"message":"Do something?", "context":"welcome"}';
    }
}