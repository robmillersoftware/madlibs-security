import GreetingTopic        from './greeting';
import BalanceTopic         from './balance';
import BillsTopic           from './bills';
import TransferTopic        from './transfer';

export default class TopicController {
    constructor(user) {
        this.user = user;
        this.topics = new Array();
        this.topics.push(new GreetingTopic(this.topics, this.user));
    }

    handleInput(msg) {
        if (this.topics.length === 0) this.topics.push(new GreetingTopic(this.topics));

        if (this.topics[this.topics.length - 1].id === 'greeting') {
            if (msg.tags.includes('bills')) {
                this.topics.push(new BillsTopic(this.topics, this.user));
            } else if (msg.tags.includes('transfer')) {
                this.topics.push(new TransferTopic(this.topics, this.user));
            } else if (msg.tags.includes('balance')) {
                this.topics.push(new BalanceTopic(this.topics, this.user));
            }
        }
        
        return this.topics[this.topics.length - 1].handleInput(msg);
    }
}