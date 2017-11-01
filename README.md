# Team MadLibs

This is the team MadLibs project for the 2017 PNC CyberFest. 

### Prerequisites

* Node.js
* Mongo DB

### Installing

1) Clone this repository `git clone https://github.com/robmillersoftware/madlibs-security.git`
2) Run `npm install`
3) Assuming everything went okay, you can deploy the server with `npm start`
4) Navigate to `localhost:5000` to see the UI

The start command will also launch a custom watch script that will execute the appropiate npm script whenever a file in
the src directory is modified, added, or removed. Additionally, nodemon is used to run the server script so whenever any
files change the server will restart.

## Built With

* [Babel](https://babeljs.io/)- es6 to es5 compiler
* [MongoDB](https://mongodb.github.io/node-mongodb-native/)- NoSQL database
* [SuperScript](https://github.com/superscriptjs/superscript)- A chatbot framework for Node.js
* [Synaptic](http://caza.la/synaptic/#/)- Neural network library

## License

This project is the sole property of PNC Bank and is not available for redistribution to any unauthorized parties.
