SmackAt
=======

Try it out
----------
Visit http://smack.at enter your name and play

Installation
------------
	$ git clone git://github.com/charlie-rudenstal/SmackAt.git
	$ cd SmackAt
	$ npm install

	And start it with

	$ node server.js

Run tests
---------
Tests are written with Mocha and Chai. They are included as packages but you need Node to run them. A makefile is inluded for your convenience:

	$ make test

Or for automatic reruns of the tests whenever a file is changed

	$ make test-watch

Continuous testing requires inotifywait from inotify-tools,
(because the watch attribute in Mocha doesn't work as expected
and nodemon has problems with attributes and maintaining colors).
Install inotify-tools with your favorite package manager.


Copyright (C) 2012 Charlie Rudenstål