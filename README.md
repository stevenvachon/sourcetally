# SourceTally
> Source code line counter for Mac/Windows/Linux & web.

* Many languages supported: [full list](https://github.com/flosse/sloc#supported-languages)
* Simultaneous support of all format types
* Full, sortable code report:
  * number of source code lines
  * number of blank lines
  * number of comment lines
  * number of mixed lines (code and comments)
  * percentage of comments, blanks and source code
  * total sum(s)
* [?] Report export: print, pdf,doc,xls,csv, clipboard

Built with [Node.js](http://nodejs.org), [node-webkit](https://github.com/rogerwang/node-webkit), [CanJS](http://canjs.com) and [sloc](https://github.com/flosse/sloc).

##### Tested for free using:
<a href="https://browserstack.com"><img src="https://stevenvachon.github.io/sourcetally/logos/browserstack.svg" width="107" height="23" alt="BrowserStack"/></a>
<a href="https://travis-ci.org"><img src="https://stevenvachon.github.io/sourcetally/logos/travis-ci.svg" width="55" height="23" alt="Travis CI"/></a>

## Roadmap Features

* Fix zip.js reading for web version
* Fix report grid sort when switching between ascending/descending
* Run sloc in a `Worker()`
* Run `getFiles()` in `vm.runInNewContext()`?
* Make report grid head/footer static when scrolling
* Add support for aliases on OSX
* Help fix https://github.com/bitovi/steal/pull/232
