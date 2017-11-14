import AbstractTopic from './abstract-topic';
import AuthenticationTopic from './authenticate';

export default class ChangeAddressTopic extends AbstractTopic {
    constructor(container, user) {
        super('balance', container, user);

        this.authTarget = 0.5;
    }

    notify(lastTopic) {
        return "Thank you for that. Proceed with address change ";
    }

    handleInput(msg) {
        if (this.user.authLevel < this.authTarget) {
            let auth = new AuthenticationTopic(this.container, this.user);
            this.container.unshift(auth);
            return '{"message":"I can definitely help you with that but before I do, I need to get to know you better. "' + auth.getQuestion() + '", "context": "auth"}';
        }

        return '{"message":"Your balance is $0 you broke bastard!", "context":"welcome"}';
    }
}