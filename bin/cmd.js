#!/usr/bin/env node

var tapNyan = require('../');

var args = process.argv.slice(2);

process.stdin
  .pipe(tapNyan())
  .pipe(process.stdout);

process.on('exit', function(status) {
  if(status === 1 || tapNyan.failed) {
    process.exit(1);
  }
});
