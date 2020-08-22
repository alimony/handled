About
=====

This node script will look for handlebar-style variables in HTML comments and output new HTML files with the variables replaced by the output of corresponding JavaScript functions from a config file.

Say you have an `index.html` containing:

```html
<h1>Some nice header</h1>
<p>A few introductory words.</p>
<!-- {{ insert_paragraph_here }} -->
```

…and a `handled.config.js` containing:

```js
exports.insert_paragraph_here = function () {
    return '<p>Another paragraph.</p>';
}
```

…when run through `handled.js` this will output `index.handled.html`:

```html
<h1>Some nice header</h1>
<p>A few introductory words.</p>
<p>Another paragraph.</p>
```

You can also have multiline variables, in which case the content between the start and end comment will be sent as input to the handler function:

```html
<h1>Some nice header</h1>
<p>A few introductory words.</p>
<!-- {{ fix_scripts -->
<script src="one.js"></script>
<script src="two.js"></script>
<!-- }} -->
```

With `handled.config.js` containing:

```js
exports.fix_scripts = function (contents) {
    return contents.replace(/script/g, 'skript');
}
```

…this will output:

```html
<h1>Some nice header</h1>
<p>A few introductory words.</p>
<skript src="one.js"></skript>
<skript src="two.js"></skript>
```

Usage
=====

First, create the file `handled.config.js` in the directory where you will run `handled.js`. You can use the included `handled.config.template.js` as a starting point. Then just run:

```
./handled.js index.html
```

Ideas
=====

Although I have not even had time myself to explore this concept fully, there could be many uses for handled.js:

* Minifying/concatenating/compiling multiple JavaScript files.
* Inserting date and/or time stamps in various places.
* Switching links to external files depending on build environment (e.g. inserting `credentials-dev.js` or `credentials-deploy.js`).
* Anything else you would use any static file template system for. :ok_hand:

Background and future
=====================

This is basically just a proof-of-concept of an idea I had on how to do some preprocessing on HTML files before deploy to e.g. GitHub, without having to use Jekyll or anything else that demands separate template files. Developing and deploying the same HTML document just seemed very convenient, and sometimes there are only a few simple replacements to be done.

There is room for much improvement on this concept, and there are a lot of you smart people out there. Let me know of any ideas or thoughts!


Created by [Markus Amalthea Magnuson](mailto:markus@polyscopic.works)
