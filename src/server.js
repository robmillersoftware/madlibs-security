import superscript from 'superscript';
import express from 'express';
import expressWs from 'express-ws';
import http from 'http';
import path from 'path';
import bodyParser from 'body-parser';

const app = express();
const ws = expressWs(app);

const PORT = process.env.PORT || 5000;

app.use(bodyParser.json());

let bot;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/pages'));

app.get('/', (req, res) => { res.render('index/index.ejs'); });
app.use('/index', express.static(path.join(__dirname, '/pages/index')));
app.use('/images', express.static(path.join(__dirname, '/assets')));

app.ws('/', (socket, req) => {
    socket.on('message', msg => {
        if (msg !== 'connected') {
          bot.reply('user1', msg, (err, reply) => {
            console.log(reply.string);
            socket.send(reply.string);
          });
        }
    });

    socket.send('Welcome to PNC! How may I assist you?');
});

const options = {
  factSystem: {
    clean: true,
  },
  importFile: __dirname + '/data.json',
};

superscript.setup(options, (err, botInstance) => {
  if (err) {
    console.error(err);
  }
  bot = botInstance;

  app.listen(PORT, () => {
    console.log(`===> 🚀  Server is now running on port ${PORT}`);
  });
});
