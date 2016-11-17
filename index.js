var PassThrough = require('stream').PassThrough;
var parser = require('tap-parser');
var duplexer = require('duplexer2');
var chalk = require('chalk');

var Nyan = require('./bin/nyan');

module.exports = function NyanReporter() {
  var out = PassThrough();
  var tap = parser();
  var stream = duplexer(tap, out);
  var nyan = new Nyan(out);

  var currentTestName = '';
  var errors = [];

  nyan.cursor.hide();

  function markFailed() { stream.failed = true; }

  tap.on('comment', function(comment) {
    currentTestName = comment;
  });

  tap.on('assert', function(res) {
    if(res.ok) {
      nyan.pass();
    } else {
      nyan.fail();
      errors.push(currentTestName + ': ' + res.name);
      markFailed();
    }
  });

  // tap.on('extra', function (extra) {
  //   out.push('   ' + extra + '\n');
  // });

  tap.on('complete', function(res) {
    nyan.cursor.show();
    out.push('\n\n\n\n');

    // Most likely a failure upstream
    if(res.plan.end < 1) {
      return markFailed();
    }

    if(errors.length || !res.ok) {
      markFailed();

      var past = (errors.length === 1) ? 'was' : 'were';
      var plural = (errors.length === 1) ? 'failure' : 'failures';

      out.push('  ' + chalk.red('Failed Tests: '));
      out.push('There ' + past + ' ' + chalk.red(errors.length) + ' ' + plural + '\n\n');

      errors.forEach(function(error) {
        out.push('    ' + chalk.red('✗') + ' ' + chalk.red(error) + '\n');
      });
    } else {
      out.push('  ' + chalk.green('Pass!') + '\n');
    }
  });

  return stream;
};
