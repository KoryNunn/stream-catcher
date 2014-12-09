var cache = require('lru-cache'),
    through = require('through');

function StreamCatcher(options){
    this._pendingWriteStreams = {};
    this._reading = {};
    this._cache = cache(options);
}
StreamCatcher.prototype.read = function(key, readStream){
    var catcher = this;

    this._cache.del(key);

    this._reading[key]++;

    var data = '';

    var cacheThrough = through(function(chunk){
        data += chunk;
        var pendingWriteStreams = catcher._pendingWriteStreams[key];

        while(pendingWriteStreams && pendingWriteStreams.length){
            var writeStream = pendingWriteStreams.pop();
            writeStream.write(data);
            readStream.pipe(writeStream);
        }
    }, function(){
        catcher._reading[key]--;
        if(catcher._reading[key] === 0){
            catcher._cache.set(key, data);
        }
    });

    readStream.pipe(cacheThrough);
};
StreamCatcher.prototype.write = function(key, writeStream, needsStream){
    var data = this._cache.get(key);

    if(data != null){
        writeStream.write(data);
        return;
    }
    
    if(!this._reading[key]){
        needsStream && needsStream(key);
    }

    this._pendingWriteStreams[key] || (this._pendingWriteStreams[key] = []);
    this._pendingWriteStreams[key].push(writeStream);
};

module.exports = StreamCatcher;