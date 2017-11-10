/**
 * Manages the state of the conversation with a particular user. Will also manage authentication
 */
import TopicController from './topics/topic-controller';

export default class ChatController {
    constructor(user) {
        this.user = user;
        this.topics = new TopicController(this.user);
    }

    handleInput(msg) {
        return this.topics.handleInput(msg);
    }
}