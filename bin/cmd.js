#!/usr/bin/env node

var through = require('through2');
var parser = require('tap-parser');
var duplexer = require('duplexer');
var chalk = require('chalk');
var out = through();
var tap = parser();
var dup = duplexer(tap, out);
var currentTestName = '';
var errors = [];
var Nyan = require('./nyan');
var nyan = new Nyan(out);
nyan.cursor.hide();
tap.on('comment', function (comment) {
  currentTestName = comment;
});
tap.on('assert', function (res) {
  if (res.ok) {
    nyan.pass();
  } else {
    nyan.fail();
    errors.push(currentTestName + ': ' + res.name);
  }

});

// tap.on('extra', function (extra) {
//   out.push('   ' + extra + '\n');
// });

tap.on('results', function (res) {
  nyan.cursor.show();
  out.push('\n\n\n\n');
  if (errors.length) {
    var past = (errors.length == 1) ? 'was' : 'were';
    var plural = (errors.length == 1) ? 'failure' : 'failures';
    
    out.push('  ' + chalk.red('Failed Tests: '));
    out.push('There ' + past + ' ' + chalk.red(errors.length) + ' ' + plural + '\n\n');
    
    errors.forEach(function (error) {
      out.push('    ' + chalk.red('✗') + ' ' + chalk.red(error) + '\n');
    });
  }
  else{
    out.push('  ' + chalk.green('Pass!') + '\n');
  }
});

process.stdin
  .pipe(dup)
  .pipe(process.stdout);
  
process.on('exit', function () {
  if (errors.length) {
    process.exit(1);
  }
});
