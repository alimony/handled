#!/usr/bin/env node

'use strict';

//
// handled.js
//
// Created by Markus Amalthea Magnuson <markus.magnuson@gmail.com>
//
// This node script will look for handlebar-style variables in HTML comments and
// output new HTML files with the variables replaced by the output of
// corresponding JavaScript functions from a config file.
//
// The variables can be either single line:
//
//     <!-- {{ replace_this_variable }} -->
//
// …or multiline:
//
//     <-- {{ replace_these_contents -->
//     [Some other HTML content.]
//     <!-- }} -->
//
// In the latter case, the contents between the two tags will be sent as input
// to the corresponding function. Each variable name should match a function
// that returns a string, defined in a file called "handled.config.js".
//
// This is basically just a proof-of-concept of an idea I had on how to do some
// preprocessing on HTML files before deploy to e.g. GitHub, without having to
// use Jekyll or anything else that demands separate template files. Developing
// and deploying the same HTML document just seemed very convenient, and
// sometimes there are only a few simple replacements to be done.
//
// There is room for much improvement on this concept, and there are a lot of
// you smart people out there. Let me know of any ideas or thoughts!
//

var configFilename = 'handled.config.js';
try {
	var config = require('./' + configFilename);
}
catch (e) {
	console.log('Could not find ' + configFilename + ', exiting.');
	process.exit(1);
}

var fs = require('fs');
var path = require('path');

// We expect all arguments to be paths to HTML files to be processed.
var htmlFiles = process.argv.slice(2);
htmlFiles.forEach(function (currentFilePath) {
	// Read the entire file as a string.
	fs.readFile(currentFilePath, 'utf8', function (error, html) {
		if (error) {
			throw error;
		}

		// Now "parse" the HTML. First, look for single line variables.
		var singlePattern = /<!-- \{\{ (\w+) \}\} -->/g;
		html = html.replace(singlePattern, function (match, variableName) {
			if (typeof config[variableName] !== 'function') {
				console.log('Could not find function "' + variableName + '" in ' + configFilename + ', exiting.');
				process.exit(1);
			}
			return config[variableName]();
		});

		// Second, look for multiline variables.
		var multiPattern = /<!-- \{\{ (\w+) -->\n([^]*)\n\W*?<!-- \}\} -->\n/g;
		html = html.replace(multiPattern, function (match, variableName, contents) {
			if (typeof config[variableName] !== 'function') {
				console.log('Could not find function "' + variableName + '" in ' + configFilename + ', exiting.');
				process.exit(1);
			}
			return config[variableName].call(null, contents);
		});

		// We have done all the replacements, write the new HTML to file.
		var oldExtension = path.extname(currentFilePath);
		var oldBasename = path.basename(currentFilePath, oldExtension);
		var newFilename = oldBasename + '.handled' + oldExtension;
		fs.writeFile(newFilename, html, function (error) {
			if (error) {
				throw error;
			}
			console.log('Done, writing new file to ' + newFilename);
		});
	});
});
