var tape = require('tape');


function runTest(name) {
  tape('test ' + name, function (t){
    t.plan(9);
    t.ok('success');
    t.equals(1,1, 'are equal');
    t.equals(1,1, 'are equal');
    t.equals(1,1, 'are equal');
    t.equals(1,1, 'are equal');
    t.equals(1,1, 'are equal');
    t.equals(1,1, 'are equal');
    t.equals(1,1, 'are equal');
    setTimeout(function () {
      t.ok(true, name + ' should be less then 83');
    }, 50);
    
  });
}

var i = 50;
while(i++<100) {
  runTest(i);
}