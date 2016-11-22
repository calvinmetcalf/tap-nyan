# tap-nyan

NYAN TAP output ~~inspired by~~ blatantly copied from Mocha's [nyan reporter](https://github.com/visionmedia/mocha/blob/master/lib/reporters/nyan.js) with much tap material taken from Scott Corgan's awesome [tap-spec reporter](https://github.com/scottcorgan/tap-spec).  Very rough at the moment.

![screen shot](http://i.imgur.com/T1eH156.png)

**Colors**

The Nyan cat color scheme will automatically be downgraded to ANSI on terminals
that doesn't support 265 colors.

For CLI color options see the [supports-color](https://github.com/chalk/supports-color#info) module.

## Install

```
npm install tap-nyan --save-dev
```

## Usage

**packge.json**

```json
{
  "name": "module-name",
  "scripts": {
    "test": "node ./test/tap-test.js | tnyan"
  }
}
```

Then run with `npm test`

**Terminal**

```
node test/test.js | node_modules/.bin/tnyan
```

**Testling**

```
npm install testling -g
testling test/test.js | node_modules/.bin/tnyan
```
