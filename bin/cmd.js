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
var passed = false;
var Nyan = require('./nyan');
var nyan = new Nyan(out);
nyan.cursor.hide();
tap.on('comment', function (comment) {
  currentTestName = comment.replace('# ', '').trim();
});
tap.on('assert', function (res) {
  if (res.ok) {
    nyan.pass();
  } else {
    nyan.fail();
    errors.push(currentTestName + ': ' + res.name);
  }

});

tap.on('complete', function (res) {
  out.push('\n\n\n\n');
  if (errors.length || !res.ok) {
    var past = (errors.length == 1) ? 'was' : 'were';
    var plural = (errors.length == 1) ? 'failure' : 'failures';

    out.push('  ' + chalk.red('Failed Tests: '));
    out.push('There ' + past + ' ' + chalk.red(errors.length) + ' ' + plural + '\n\n');

    errors.forEach(function (error) {
      out.push('    ' + chalk.red('✗') + ' ' + chalk.red(error) + '\n');
    });
  }
  else{
    passed = true;
    out.push('  ' + chalk.green('Pass!') + '\n');
  }
});

process.stdin
  .pipe(dup)
  .pipe(process.stdout);

process.on('exit', function () {
  nyan.cursor.show();
  if (errors.length || !passed) {
    process.exit(1);
  }
});
