.SILENT:

default: test-watch

test: 
		node node_modules/mocha/bin/mocha -u bdd -R min test/src -r test/vendor/chai

test-watch:
		# mocha -w won't reload source files
		#@mocha -u bdd -R min src/* -w -r chai

		# nodemon cannot pass parameters properly and also removes 
		# the nice colors from mocha
		#@nodemon -w public/src -x node_modules/mocha/bin/mocha -u bdd -R min -w test/src/* -r test/vendor/chai
		#@nodemon -w test/src -w public/src node_modules/mocha/bin/mocha test/src -R min

		# good old inotifywait does the trick
		make test

		while true ; do \
			inotifywait -qqr . ; \
			make test ; \
		done

.PHONY: test