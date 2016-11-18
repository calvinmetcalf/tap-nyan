#!/usr/bin/env node

var tapNyan = require('../');

var args = process.argv.slice(2);
var ansi = false;
for(var i = 0; i < args.length && !ansi; i++) {
  if(args[i] === '--ansi') { ansi = true; }
}

process.stdin
  .pipe(tapNyan(ansi))
  .pipe(process.stdout);

process.on('exit', function(status) {
  if(status === 1 || tapNyan.failed) {
    process.exit(1);
  }
});
