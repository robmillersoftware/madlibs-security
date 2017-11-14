/**
 * This is the default topic for a conversation
 */
import AbstractTopic from './abstract-topic';

let greetings = ['Hey', 'Hi', 'Hello'];
let patter= ['Uh-huh', "Oh, that's interesting", 'Oh yeah?', 'Wow', 'I know, right?', "He's a jerk", "She's the worst"];

export default class GreetingTopic extends AbstractTopic {
    constructor(container, user) {
        super('greeting', container, user);
        this.states.push('hello');
        this.states.push('small-talk');
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
        let rtn = '';
        if (this.state === 'hello') {
            rtn = '' + this.randomGreeting();
            if (msg.raw.match('.*how.*are.*you.*')) {
                rtn = rtn.concat(". I'm doing very well, thanks for asking! How are you?");
            }
            this.state = 'small-talk';
            return '{"message":"' + rtn + '", "context":""}';
        } else if (this.state === 'rejected') {
            this.user.reject();
            return '{"message":"I was unable to authenticate your account. Please contact customer support for further inquiries", "context":""}';
        }
        return '{"message":"Echoing: ' + msg.raw + ' from GreetingTopic", "context":""}';
    }
}