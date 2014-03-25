var tty = require('tty');
var isatty = tty.isatty(1) && tty.isatty(2);
var windowWidth = isatty
    ? process.stdout.getWindowSize
      ? process.stdout.getWindowSize(1)[0]
      : tty.getWindowSize()[1]
    : 75;
module.exports = NyanCat;
function NyanCat(out) {
  this.out = out;
  this.stats = { suites: 0, tests: 0, passes: 0, pending: 0, failures: 0 }
  var self = this
    , stats = this.stats
    , width = windowWidth * .75 | 0
    , rainbowColors = this.rainbowColors = self.generateColors()
    , colorIndex = this.colorIndex = 0
    , numerOfLines = this.numberOfLines = 4
    , trajectories = this.trajectories = [[], [], [], []]
    , nyanCatWidth = this.nyanCatWidth = 11
    , trajectoryWidthMax = this.trajectoryWidthMax = (width - nyanCatWidth)
    , scoreboardWidth = this.scoreboardWidth = 5
    , tick = this.tick = 0
    , n = 0;
    this.cursor = {
      hide: function(){
        isatty && process.stdout.write('\u001b[?25l');
      },

      show: function(){
        isatty && process.stdout.write('\u001b[?25h');
      },

      deleteLine: function(){
        isatty && process.stdout.write('\u001b[2K');
      },

      beginningOfLine: function(){
        isatty && process.stdout.write('\u001b[0G');
      },

      CR: function(){
        if (isatty) {
          cursor.deleteLine();
          cursor.beginningOfLine();
        } else {
          process.stdout.write('\r');
        }
      }
    };
    this.colors = {
      'pass': 90
    , 'fail': 31
    , 'bright pass': 92
    , 'bright fail': 91
    , 'bright yellow': 93
    , 'pending': 36
    , 'suite': 0
    , 'error title': 0
    , 'error message': 31
    , 'error stack': 90
    , 'checkmark': 32
    , 'fast': 90
    , 'medium': 33
    , 'slow': 31
    , 'green': 32
    , 'light': 90
    , 'diff gutter': 90
    , 'diff added': 42
    , 'diff removed': 41
  };
}

/**
 * Draw the nyan cat
 *
 * @api private
 */
NyanCat.prototype.pass = function(){
  this.stats.passes++;
  this.draw();
};
NyanCat.prototype.fail = function(){
  this.stats.failures++;
  this.draw();
};
NyanCat.prototype.draw = function(){
  this.appendRainbow();
  this.drawScoreboard();
  this.drawRainbow();
  this.drawNyanCat();
  this.tick = !this.tick;
};

/**
 * Draw the "scoreboard" showing the number
 * of passes, failures and pending tests.
 *
 * @api private
 */

NyanCat.prototype.drawScoreboard = function(){
  var stats = this.stats;
  var colors = this.colors;
  var self = this;
  function draw(color, n) {
    self.out.push(' ');
    self.out.push('\u001b[' + color + 'm' + n + '\u001b[0m');
    self.out.push('\n');
  }

  draw(colors.green, stats.passes);
  draw(colors.fail, stats.failures);
  draw(colors.pending, stats.pending);
  self.out.push('\n');

  this.cursorUp(this.numberOfLines);
};

/**
 * Append the rainbow.
 *
 * @api private
 */

NyanCat.prototype.appendRainbow = function(){
  var segment = this.tick ? '_' : '-';
  var rainbowified = this.rainbowify(segment);

  for (var index = 0; index < this.numberOfLines; index++) {
    var trajectory = this.trajectories[index];
    if (trajectory.length >= this.trajectoryWidthMax) trajectory.shift();
    trajectory.push(rainbowified);
  }
};

/**
 * Draw the rainbow.
 *
 * @api private
 */

NyanCat.prototype.drawRainbow = function(){
  var self = this;

  this.trajectories.forEach(function(line, index) {
    this.out.push('\u001b[' + self.scoreboardWidth + 'C');
    this.out.push(line.join(''));
    this.out.push('\n');
  }, this);

  this.cursorUp(this.numberOfLines);
};

/**
 * Draw the nyan cat
 *
 * @api private
 */

NyanCat.prototype.drawNyanCat = function() {
  var self = this;
  var startWidth = this.scoreboardWidth + this.trajectories[0].length;
  var color = '\u001b[' + startWidth + 'C';
  var padding = '';

  this.out.push(color);
  this.out.push('_,------,');
  this.out.push('\n');

  this.out.push(color);
  padding = self.tick ? '  ' : '   ';
  this.out.push('_|' + padding + '/\\_/\\ ');
  this.out.push('\n');

  this.out.push(color);
  padding = self.tick ? '_' : '__';
  var tail = self.tick ? '~' : '^';
  var face;
  this.out.push(tail + '|' + padding + this.face() + ' ');
  this.out.push('\n');

  this.out.push(color);
  padding = self.tick ? ' ' : '  ';
  this.out.push(padding + '""  "" ');
  this.out.push('\n');

  this.cursorUp(this.numberOfLines);
};

/**
 * Draw nyan cat face.
 *
 * @return {String}
 * @api private
 */

NyanCat.prototype.face = function() {
  var stats = this.stats;
  if (stats.failures) {
    return '( x .x)';
  } else if (stats.pending) {
    return '( o .o)';
  } else if(stats.passes) {
    return '( ^ .^)';
  } else {
    return '( - .-)';
  }
}

/**
 * Move cursor up `n`.
 *
 * @param {Number} n
 * @api private
 */

NyanCat.prototype.cursorUp = function(n) {
  this.out.push('\u001b[' + n + 'A');
};

/**
 * Move cursor down `n`.
 *
 * @param {Number} n
 * @api private
 */

NyanCat.prototype.cursorDown = function(n) {
  this.out.push('\u001b[' + n + 'B');
};

/**
 * Generate rainbow colors.
 *
 * @return {Array}
 * @api private
 */

NyanCat.prototype.generateColors = function(){
  var colors = [];

  for (var i = 0; i < (6 * 7); i++) {
    var pi3 = Math.floor(Math.PI / 3);
    var n = (i * (1.0 / 6));
    var r = Math.floor(3 * Math.sin(n) + 3);
    var g = Math.floor(3 * Math.sin(n + 2 * pi3) + 3);
    var b = Math.floor(3 * Math.sin(n + 4 * pi3) + 3);
    colors.push(36 * r + 6 * g + b + 16);
  }

  return colors;
};

/**
 * Apply rainbow to the given `str`.
 *
 * @param {String} str
 * @return {String}
 * @api private
 */

NyanCat.prototype.rainbowify = function(str){
  var color = this.rainbowColors[this.colorIndex % this.rainbowColors.length];
  this.colorIndex += 1;
  return '\u001b[38;5;' + color + 'm' + str + '\u001b[0m';
};
