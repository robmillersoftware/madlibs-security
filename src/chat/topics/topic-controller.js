import GreetingTopic        from './greeting';
import BalanceTopic         from './balance';
import PayBillTopic         from './pay-bill';
import TransferTopic        from './transfer';
import SetupBillerTopic     from './setup-biller';
import AccountDetailsTopic  from './account-details';
import ChangeAddressTopic   from './change-address';
import PayOthersTopic        from './pay-others';

export default class TopicController {
    constructor(user) {
        this.user = user;
        this.topics = new Array();
        this.topics.push(new GreetingTopic(this.topics, this.user));
    }

    handleInput(msg) {
        if (this.topics.length === 0) this.topics.unshift(new GreetingTopic(this.topics));

        if (this.topics[this.topics.length - 1].id === 'greeting') {
            if (msg.tags.includes('account-details')) {
                this.topics.unshift(new AccountDetailsTopic(this.topics, this.user));
            } else if (msg.tags.includes('balance')) {
                this.topics.unshift(new BalanceTopic(this.topics, this.user));
            } else if (msg.tags.includes('change-address')) {
                this.topics.unshift(new ChangeAddressTopic(this.topics, this.user));
            } else if (msg.tags.includes('pay-bill')) {
                this.topics.unshift(new PayBillTopic(this.topics, this.user));
            } else if (msg.tags.includes('pay-others')) {
                this.topics.unshift(new PayOtherTopic(this.topics, this.user));
            } else if (msg.tags.includes('setup-biller')) {
                this.topics.unshift(new SetupBillerTopic(this.topics, this.user));
            } else if (msg.tags.includes('transfer')) {
                this.topics.unshift(new TransferTopic(this.topics, this.user));
            }
        }
        
        return this.topics[0].handleInput(msg);
    }
}