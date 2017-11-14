/**
 * This is the default topic for a conversation
 */
import AbstractTopic from './abstract-topic';

export default class GreetingTopic extends AbstractTopic {
    constructor(container, user) {
        super('greeting', container, user);
        this.states.push('rejected');

        this.state = 'hello';
    }

    randomGreeting() {
        let idx = Math.floor(Math.random() * greetings.length);
        return greetings[idx];
    }

    randomPatter() {
        let idx = Math.floor(Math.random() * patter.length);
        return patter[idx];
    }

    notify(lastTopic) {
        return "Is there anything else I can help you with?";
    }

    handleInput(msg) {
        if (this.state === 'rejected') {
            this.user.reject();
            return '{"message":"I was unable to authenticate your account. Please contact customer support for further inquiries", "context":"rejected"}';
        }
        return '{"message":"Is there anything else I can help you with?", "context":"welcome"}';
    }
}