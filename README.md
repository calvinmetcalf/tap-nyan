# tap-nyan
 
NYAN TAP output ~~like~~ coppied from Mocha's nyan reporter

![Output screenshot](http://i.imgur.com/3yh5prr.png)
 
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
