var test = require('tape'),
    fs = require('fs'),
    ReadableStream = require('readable-stream'),
    concatStream = require('concat-stream'),
    StreamCatcher = require('../'),
    testFilePath = __dirname + '/test.txt';

test('stream to target', function(t){
    t.plan(1);

    var catcher = new StreamCatcher({
        length: function(n){ 
            return n.length;
        },
        dispose: function(key, n){ 
            n.close();
        },
        maxAge: 1000 * 60 * 60
    });

    var expected = fs.readFileSync(testFilePath);

    catcher.write(
        'foo', 
        concatStream(function(data){
            t.equal(data.toString(), expected.toString());
        }),
        function(key){
            catcher.read(key, fs.createReadStream(testFilePath));
        }
    ); 
});

test('stream to target', function(t){
    t.plan(1);

    var catcher = new StreamCatcher({
        length: function(n){ 
            return n.length;
        },
        dispose: function(key, n){ 
            n.close();
        },
        maxAge: 1000 * 60 * 60
    });

    var expected = fs.readFileSync(testFilePath);

    catcher.write(
        testFilePath, 
        concatStream(function(data){
            t.equal(data.toString(), expected.toString());
        })
    ); 

    catcher.read(testFilePath, fs.createReadStream(testFilePath));
});

test('stream to target', function(t){
    t.plan(1);

    var catcher = new StreamCatcher({
        length: function(n){ 
            return n.length;
        },
        dispose: function(key, n){ 
            n.close();
        },
        maxAge: 1000 * 60 * 60
    });

    var expected = fs.readFileSync(testFilePath);
    
    catcher.read(testFilePath, fs.createReadStream(testFilePath));

    catcher.write(
        testFilePath, 
        concatStream(function(data){
            t.equal(data.toString(), expected.toString());
        })
    ); 

});