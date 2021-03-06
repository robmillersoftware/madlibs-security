import superscript      from 'superscript';         //Bot framework, handles input and replies
import express          from 'express';             //http server
import expressWs        from 'express-ws';          //ws server
import path             from 'path';                //Handles filesystem paths
import bodyParser       from 'body-parser';         //Gives access to JSON body for http requests
import UserConnection   from './chat/chat-user';    //Manages a single user's connection to the chat bot
import MongoConnect     from './db/mongo-connect';  //Wrapper for the connection to the Mongo DB

const uuid = require('uuid/v4');

//Set up express
const app = express();
const ws = expressWs(app);
const PORT = process.env.PORT || 5000;
const mongoURI = process.env.MONGODB_URI || 'mongodb://pnc-madlibs:cfo12345@ds157475.mlab.com:57475/heroku_lf1gc35j';
const serverUrl = process.env.DYNO ? 'wss://young-river-54256.herokuapp.com/' : 'ws://localhost:5000';

//Array of user connections
let users = [];
let observers = [];

//Superscript instance
let bot;

let convId = null;

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
  let conversationId = req.body.originalRequest.source === 'google' ? req.body.originalRequest.data.conversation.conversationId : 'undefined';
  let userId = req.body.originalRequest.source === 'google' ? req.body.originalRequest.data.user.userId : 'undefined';
  let user = null;

  console.log('user: ' + userId);
  if (conversationId !== convId) {
    console.log('resetting');
    users = [];
    convId = conversationId;
  }

  if (userId === 'undefined') {
    user = new UserConnection(bot, mongo, null, uuid());
    users.push(user);
  } else {
    users.forEach(usr => {
      if (usr.uuid === userId) {
        user = usr;
      }
    });

    if (user === null) {
      user = new UserConnection(bot, mongo, null, userId);
      users.push(user);
    }
  }

  user.handleRequest(req, res);
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
  socket.on('message', msg => {
    console.log(msg);            
  });
  
  socket.on('close', () => {
      console.log('Connection to user was closed');
  });
  
  observers.push(socket);
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
    let rtn = "It appears we have nothing to talk about.....good day";

    observers.forEach((sock, i) => {
      if (sock.readyState === sock.OPEN) {
        sock.send(JSON.stringify({msg: msg.raw, uuid: null, party: 'you'}));
      }
    });

    //Loop through the users looking for a matching ID
    users.forEach((sock, i) => {
      //If this socket is closed, then remove it from the array
      if (!sock.isOpen){
        users.splice(i, 1);
      } else if (id === sock.uuid) {
          rtn = sock.handleInput(msg);
      }
    });

    observers.forEach(sock => {
      if (sock.readyState === sock.OPEN) {
        sock.send(JSON.stringify({msg: JSON.parse(rtn).message, uuid: null, party: 'pnc'}));
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
