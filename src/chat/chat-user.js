/**
 * Handles all user operations for the chat. This is where the vast majority of the logic lives
 */
import ChatController from './chat-controller';
import UserSchema from '../db/user';

var uuid = require('uuid/v4');

export default class UserConnection {
    /**
     * Builds a new user. Also pulls data from mongo if it exists
     * @param {*} socket- a websocket connection 
     * @param {*} bot- a superscript instance
     * @param {*} db- a reference to the mongo-connect singleton
     */
    constructor(socket, bot, db, requestId) {
        this.authLevel = 0.0;   //This value represents how much this user is currently trusted 
        this.isOpen = true;     //Denotes that the websocket connection is open
        this.history = [];      //The history for this session
        this.requestId = requestId;

        let id = null;

        //Save a reference to this for the websocket callbacks
        var obj = this;

        socket.on('message', msg => {
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
                        uuid: id,
                        requestId: obj.requestId
                    }

                    socket.send(JSON.stringify(response));

                    setTimeout(sendReply, 500);
                }

                sendReply();
              });
            }
        });

        socket.on('close', () => {
            console.log('Connection to user: ' + obj.uuid + ' was closed');

            //Save this user before disconnecting
            obj.update();
            obj.isOpen = false;
        });
    
        if (id === null) {
            id = uuid();
        }

        this.db = db;
        this.uuid = id;
        this.ws = socket;
        this.bot = bot;

        //The chat controller manages the state of the chatbot in regards to this user
        this.controller = new ChatController(this);

        let resp = {
            msg: 'Welcome to PNC! How may I assist you?',
            uuid: this.uuid
        };

        this.ws.send(JSON.stringify(resp));
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