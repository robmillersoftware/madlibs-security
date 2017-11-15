/**
 * Handles all user operations for the chat. This is where the vast majority of the logic lives
 */
import ChatController from './chat-controller';
import UserSchema from '../db/user';
import WebSocket from 'ws';

const accounts = require('../api/accounts.json');
var uuidv4 = require('uuid/v4');

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
        this.uuid = uuid ? uuid : uuidv4();
        this.bot = bot;
        this.savingsAccountBalance = accounts.content[0].balance;
        this.acctBalance = accounts.content[1].balance;
        this.creditAccountBalance = accounts.content[2].balance;
        this.address = accounts.content[0].businessUnit.address;

        //The chat controller manages the state of the chatbot in regards to this user
        this.controller = new ChatController(this);

        /*if (socket) {
            this.initializeWebSocket();
        }*/
    }

    initializeWebSocket() {
        let obj = this;

        obj.ws.on('message', msg => {
            let message = JSON.parse(msg);

            //obj.buildUser();

            //Connected is the first message sent by the user and doesn't merit a response
            if (message.string !== 'connected') {
                obj.bot.reply(obj.uuid, message.string, (err, reply) => {
                    if (err) console.error(err);
                    let replyArr = reply.string.split('|');
                    let sendReply = () => {
                        if (replyArr.length === 0) return;

                        let response = {
                            msg: replyArr.shift(),
                            uuid: obj.uuid
                        }

                        obj.ws.send(JSON.stringify(response));
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
            uuid: obj.uuid
        };

        obj.ws.send(JSON.stringify(resp));
    }

    handleRequest(req, res) {
        let message = req.body;

        this.bot.reply(this.uuid, message.result.resolvedQuery, (err, reply) => {
            if (err) console.error(err);

            let replyObj = JSON.parse(reply.string);
            let context = replyObj.context !== "" ? [{name:replyObj.context}] : [];
            let followup = replyObj.context === "reset" ? {name:"goodbye"} : {};

            let response = {
                speech: replyObj.message,
                displayText: replyObj.message,
                data: {},
                contextOut: [{name: "welcome-followup"}, {name: "welcome"}],
                source: '',
                followupEvent: followup
            };

            res.send(JSON.stringify(response));
        });
    }

    reset() {
       this.authLevel = 0.0;
       this.savingsAccountBalance = accounts.content[0].balance;
       this.acctBalance = accounts.content[1].balance;
       this.creditAccountBalance = accounts.content[2].balance;

       return '{"message":"", "context":"reset"}';
    }
    
    /**
     * Fills this user's properties with data from Mongo if the user's ID is found
     * @param {*} id 
     */
    buildUser() {
        let profile = this.db.read('users', {uuid: this.uuid});
        if (profile) {
            this.uuid = profile.uuid;
            this.history = profile.history;
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
        this.db.update('users', { uuid: this.uuid }, new UserSchema(this));
    }

    /**
     * Handles user input coming from superscript
     * @param {*} msg 
     */
    handleInput(msg) {
        let rtn = this.controller.handleInput(msg);
       // this.addHistory(rtn);
        return rtn;
    }
}