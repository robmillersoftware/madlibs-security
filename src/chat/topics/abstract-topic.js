export default class AbstractTopic {
    constructor(id, container, user) {
        if (this.constructor === AbstractTopic) {
            throw new TypeError("Cannot instantiate an instance of AbstractTopic");
        }

        this.id = id;
        this.states = [];
        this.container = container;
        this.user = user;
    }

    get state() {
        return this.states[0];
    }

    set state(newState) {
        let temp = this.states[0];
        let idx = 0;

        this.states.forEach((st, i) => {
            if (st === newState) {
                idx = i;
            }
        });

        this.states[0] = this.states[idx];
        this.states[idx] = temp;
    }

    notify(lastTopic) {
        return "Why are you still here?";
    }

    handleInput() {
        console.log("Descendants of AbstractTopic must overwrite handleInput");
    }
}