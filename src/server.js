import superscript    from 'superscript';         //Bot framework, handles input and replies
import express        from 'express';             //http server
import expressWs      from 'express-ws';          //ws server
import path           from 'path';                //Handles filesystem paths
import bodyParser     from 'body-parser';         //Gives access to JSON body for http requests
import UserConnection from './chat/chat-user';    //Manages a single user's connection to the chat bot
import MongoConnect   from './db/mongo-connect';  //Wrapper for the connection to the Mongo DB

//Set up express
const app = express();
const ws = expressWs(app);
const PORT = process.env.PORT || 5000;

//Mongo connection defaults to mlab. If -local is specified instead, then connect to the local mongo daemon
let mongoURI = 'mongodb://pnc-madlibs:cfo12345@ds042607.mlab.com:42607/pnc-madlibs';
 
let args = process.argv.slice(2);
if (args.length >= 1 && args[0] === '-local') {
  mongoURI = 'mongodb://localhost';
}

//Array of user connections
let users = [];

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
//R- read operations
app.get('/', (req, res) => { res.render('index/index.ejs'); });

//U- update operations
//D- delete operations

//Websocket connection established. Create new user connection
app.ws('/', (socket, req) => {
  let user = new UserConnection(socket, bot, mongo);
  users.push(user);
});

//Options for superscript
const options = {
  factSystem: {
    clean: true,
  },
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
