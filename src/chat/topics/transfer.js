import AbstractTopic from './abstract-topic';
import AuthenticationTopic from './authenticate';

export default class TransferTopic extends AbstractTopic {
    constructor(container,user) {
        super('transfer', container, user);

        this.authTarget = 2.5;
    }

    notify(lastTopic) {
        return ["Thank you for that. We're ready to transfer money.", "Which account would you like to transfer from?"];
    }

    handleInput(msg) {
        if (this.user.authLevel < this.authTarget) {
            let auth = new AuthenticationTopic(this.container, this.user);
            this.container.push(auth);
            return ["I can definitely help you with that but before I do, I need to get to know you better", auth.getQuestion()];
        }

        return ("Echoing: " + msg.raw + " from TransferTopic");
    }
}