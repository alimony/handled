#!/usr/bin/env node

'use strict';

//
// handled.js
//
// Created by Markus Amalthea Magnuson <markus.magnuson@gmail.com>
//
// This file will be imported by handled.js and used for processing HTML files
// containing handlebar-style comments. All found variable names should match a
// function exported from this config file. See the following example code:
//

// Handler for:
//     <!-- {{ replace_this_variable }} -->
exports.replace_this_variable = function () {
	return 'replaced';
}

// Handler for:
//     <-- {{ replace_these_contents -->
//     [Some other HTML content.]
//     <!-- }} -->
exports.replace_these_contents = function (contents) {
	return 'foo' + contents + 'bar';
}
