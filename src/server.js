import 'babel-polyfill';

import superscript      from 'superscript';         //Bot framework, handles input and replies
import express          from 'express';             //http server
import expressWs        from 'express-ws';          //ws server
import path             from 'path';                //Handles filesystem paths
import bodyParser       from 'body-parser';         //Gives access to JSON body for http requests
import UserConnection   from './chat/chat-user';    //Manages a single user's connection to the chat bot
import MongoConnect     from './db/mongo-connect';  //Wrapper for the connection to the Mongo DB
import WebSocket        from 'ws';

const uuid = require('uuid/v4');

//Set up express
const app = express();
const ws = expressWs(app);
const PORT = process.env.PORT || 5000;
const mongoURI = process.env.MONGODB_URI || 'mongodb://pnc-madlibs:cfo12345@ds157475.mlab.com:57475/heroku_lf1gc35j';
const serverUrl = process.env.DYNO ? 'wss://young-river-54256.herokuapp.com/' : 'ws://localhost:5000';

//Array of user connections
let users = [];

//Queue of requests that need to be responded to by the back end
let requests = [];

//Superscript instance
let bot;

//Initialize the MongoDB wrapper
let mongo = new MongoConnect();
mongo.init(mongoURI);

//Set up middleware
app.use(bodyParser.json());

//Set up static paths
app.use('/index', express.static(path.join(__dirname, '/pages/index')));
app.use('/images', express.static(path.join(__dirname, '/assets')));

//Set Express to render .ejs files from the pages directory
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/pages'));

//C- create operations
app.post('/dialogflow', (req, res) => {
  //Create a new request ID, so the WS server knows to resolve the request later
  let requestId = uuid();
  requests[requestId] = res;

  let userId = req.body.result.source === 'google' ? req.body.originalRequest.data.user.user_id : 'undefined';
  let ws = new WebSocket(serverUrl);

  ws.on('open', function() {
    let msg = {
      id: userId,
      requestId: requestId,
      string: req.body.result.resolvedQuery
    }

    console.log('sending: ' + JSON.stringify(msg));
    ws.send(JSON.stringify(msg));
  });

  ws.on('message', msg => {
    console.log("responding: " + JSON.stringify(msg));
    let response = {
      speech: msg.msg,
      displayText: msg.msg,
      data: {},
      contextOut: [],
      source: '',
      followupEvent: {}
    };
    
    requests[msg.requestId].send(JSON.stringify(response));
    delete requests[msg.requestId];
  });
});

//R- read operations
app.get('/', (req, res) => { 
  res.render('index/index.ejs', {
    serverUrl: serverUrl
  }); 
});

app.get('/privacy', (req, res) => {
  res.render('privacy/privacy.ejs');
});

//U- update operations
//D- delete operations

//Websocket connection established. Create new user connection
app.ws('/', (socket, req) => {
  console.log('Got websocket request: ' + JSON.stringify(req));
  wsrpc(socket);
  let user = new UserConnection(socket, bot, mongo, req.requestId);
  users.push(user);
});

//Options for superscript
const options = {
  factSystem: {
    clean: true,
  },
  logPath: null,
  mongoURI: mongoURI,
  pluginsPath: __dirname + '/plugins',
  importFile: __dirname + '/data.json',
};

//Since we are bypassing the conversation system, we instead pass received messages to the appropriate user
options.scope = {
  handleInput: (id,msg) => { 
    //The user should never see this.If they do, then they are doing something malicious or something has gone horribly wrong
    let rtn = "It appears we have nothing to talk about.....good day"

    //Loop through the users looking for a matching ID
    users.forEach((sock, i) => {
      //If this socket is closed, then remove it from the array
      if (!sock.isOpen){
        users.splice(i, 1);
      } else if (id === sock.uuid){;
        let res = sock.handleInput(msg);

        //If an array is returned from handleInput, then we need to send multiple messages
        if (Array.isArray(res)) {
          rtn = res.join('|');
        } else {
          rtn = res;
        }
      }
    });
    return rtn;
  }
}

//Set up superscript after connections to Mongo is established
superscript.setup(options, (err, botInstance) => {
  if (err) {
    console.error(err);
  }

  bot = botInstance;

  //Start express server after mongo and superscript are up and running
  app.listen(PORT, () => {
    console.log(`===> 🚀  Server is now running on port ${PORT}`);
  });
});
