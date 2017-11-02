import superscript  from 'superscript';
import express      from 'express';
import expressWs    from 'express-ws';
import http         from 'http';
import path         from 'path';
import bodyParser   from 'body-parser';
import MongoClient  from 'mongodb';

//Set up express
const app = express();
const ws = expressWs(app);
const PORT = process.env.PORT || 5000;
const mongoURI = 'mongodb://pnc-madlibs:cfo12345@ds042607.mlab.com:42607/pnc-madlibs';

let bot;
let database;

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

//Websocket connection established
app.ws('/', (socket, req) => {
    socket.on('message', msg => {
        if (msg !== 'connected') {
          bot.reply('user1', msg, (err, reply) => {
            socket.send(reply.string);
          });
        }
    });

    socket.send('Welcome to PNC! How may I assist you?');
});

//These are the options being passed to superscript
const options = {
  factSystem: {
    clean: true,
  },
  mongoURI: mongoURI,
  importFile: __dirname + '/data.json',
};

//Connect to MongoDB
MongoClient.connect(mongoURI, (err, db) => {
  if (err) {
    console.error(err);
  }

  database = db;

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
});
