/**
 * Handles all user operations for the chat. This is where the vast majority of the logic lives
 */
import ChatController from './chat-controller';
import UserSchema from '../db/user';

var uuid = require('uuid/v4');

export default class UserConnection {
    /**
     * Builds a new user. Also pulls data from mongo if it exists. Handles either a websocket or HTTP
     * connection
     * @param {*} bot- a superscript instance
     * @param {*} db- a reference to the mongo-connect singleton
     * @param {*} socket- a websocket connection (Optional)
     * @param {*} uuid- the ID for this user (Optional)
     */
    constructor(bot, db, socket, uuid) {
        this.authLevel = 0.0;       //This value represents how much this user is currently trusted 
        this.isOpen = true;         //Denotes that the websocket connection is open
        this.history = [];          //The history for this session
        this.ws = socket;           //Websocket connection if any
        this.db = db;
        this.uuid = uuid;
        this.bot = bot;

        //The chat controller manages the state of the chatbot in regards to this user
        this.controller = new ChatController(this);

        if (!this.uuid) {
            this.uuid = uuid();
            console.log("literally right before");
            this.initializeWebSocket();
            console.log("literally right after");
        }
    }

    initializeWebSocket() {
        let obj = this;

        console.log('hello?wtf');
        obj.ws.on('message', msg => {
            console.log("we shouldn't be here");
            let message = JSON.parse(msg);

            //If there is an id attached to the message from the user, then check for an existing user profile in the DB and load the data
            if (message.id !== "undefined" && message.id !== id) {
                id = message.id;
                obj.buildUser(id);
            }

            //Connected is the first message sent by the user and doesn't merit a response
            if (message.string !== 'connected') {
              bot.reply(id, message.string, (err, reply) => {
                if (err) console.error(err);
                let replyArr = reply.string.split('|');
                let sendReply = () => {
                    if (replyArr.length === 0) return;

                    let response = {
                        msg: replyArr.shift(),
                        uuid: id
                    }

                    socket.send(JSON.stringify(response));

                    setTimeout(sendReply, 500);
                }

                sendReply();
              });
            }
        });

        obj.ws.on('close', () => {
            console.log('Connection to user: ' + obj.uuid + ' was closed');

            //Save this user before disconnecting
            obj.update();
            obj.isOpen = false;
        });

        let resp = {
            msg: 'Welcome to PNC! How may I help you?',
            uuid: this.uuid
        };

        obj.ws.send(JSON.stringify(resp));
    }

    handleRequest(req, res) {
        let message = req.body;

        console.log('inside handle: ' + message.result.resolvedQuery);
        this.bot.reply(this.uuid, message.result.resolvedQuery, (err, reply) => {
            if (err) console.error(err);
            let replyArr = reply.string.split('|');
            let sendReply = () => {
                /*if (replyArr.length === 0) {
                    res.end();
                    return;
                }*/

                let msg = replyArr.shift();

                let response = {
                    speech: msg,
                    displayText: msg,
                    data: {},
                    contextOut: [],
                    source: '',
                    followupEvent: {}
                };
  
                console.log('replying: ' + JSON.stringify(response));
                res.write(JSON.stringify(response));
                setTimeout(sendReply, 500);
            }

            sendReply();
        });
    }

    /**
     * Fills this user's properties with data from Mongo if the user's ID is found
     * @param {*} id 
     */
    buildUser(id) {
        let profile = this.db.read('users', {id: id});
        if (profile) {
            this.uuid = id;
        }
    }

    /**
     * Adds a new message to the history for this session
     * @param {*} msg 
     */
    addHistory(msg) {
        this.history.push(msg);
        if (this.history.length > 100) this.history.shift();
        this.update();
    }

    /**
     * Updates this user's entry in the DB
     */
    update() {
        this.db.update('users', { id: this.uuid }, new UserSchema(this));
    }

    /**
     * Handles user input coming from superscript
     * @param {*} msg 
     */
    handleInput(msg) {
        let rtn = this.controller.handleInput(msg);
        this.addHistory(rtn);
        return rtn;
    }
}