---
USE THIS README.md AS A STARTING POINT FOR YOUR OWN PROJECT. DELETE THIS SECTION AND MODIFY THE REST TO YOUR HEART'S CONTENT
---
# Project Title

One Paragraph of project description goes here

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Prerequisites

You will need Node.js installed with npm on your build path

### Installing

1) Run `npm install -g gulp`
2) Clone this repository `git clone https://github.com/robmillersoftware/template.git`
3) Push the master branch to your own repository
```
git remote set-url origin <repoAddress>
git push origin master
```

4) (Optional) Create your own branch (i.e. develop) with `git checkout -b develop master`
5) Run `npm install`
6) Assuming everything went okay, you can deploy the Hello World page to your browser with `gulp`
7) Navigate to `localhost:3000` in your browser to see the Hello World page. Check the developer tools console to see a hello world message coming from javascript.

## How it works (feel free to delete this section once you understand how the template works)

Gulp pulls in all of its tasks from the gulp/tasks folder using the gulp/index.js file. When you run 'gulp', it executes the default which is 
the 'dev' task. The dev task copies all necessary files, minifies and browserifies all files under src/js, and sets up some watches. It then sets up the browser-sync server at localhost:3000.

The directory structure after building is as follows:

```
.
|
+-- dist
|   +-- assets 
|   +-- js 
|      +-- maps
|      index.js
|   +-- libs
|      globals.js
|      utils.js
|   index.html
+-- gulp
+-- node_modules
+-- src
.gitignore
gulpfile.js
LICENSE.md
package.json
README.md
```

The dist/assets is a direct copy of src/assets. It's empty in the template project, so you won't see anything under dist. The lib directory is also a copy. The js directory contains all of the javascript under src/js concatenated to a single file and uglified. dist/js/maps contains the sourcemaps for the original JS files to aid in debugging.

## Built With

* [Gulp](https://gulpjs.com/)- build and workflow
* [Babel](https://babeljs.io/)- es6 to es5 compiler
* [Browserify](http://browserify.org/)- Use Node.js syntax in browser and bundle all source files to single .js file
* [UglifyJS](https://github.com/mishoo/UglifyJS)- minify code
* [Vinyl](https://github.com/gulpjs/vinyl)- provides metadata for file handling

## License

This template project is licensed under the ISC License - see the [LICENSE.md](LICENSE.md) file for details
Feel free to modify this section and the LICENSE.md file to suit your needs.

## Acknowledgments

* Rob Miller for his [awesome free project template](https://github.com/robmillersoftware/template)
* etc
