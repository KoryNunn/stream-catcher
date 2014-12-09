# stream-catcher

a streaming wrapper around lru-cache

# usage

```javascript
var streamCache = new StreamCatcher({
    length: function(n){ 
        return n.length;
    },
    dispose: function(key, n){ 
        n.close();
    },
    maxAge: 1000 * 60 * 60
});

streamCache.stream('key', readStream, writeStream);
```

# example

stream files from disk to a http response, cached for next time.

```javascript
var filePath = './foo/bar.txt';

// First call: Nms
streamCache.stream(filePath, fs.createReadStream(filePath), response);

// Next call: <Nms
streamCache.stream(filePath, fs.createReadStream(filePath), response);

// Time passes, file falls out of cache...

// Next call ~ Nms
streamCache.stream(filePath, fs.createReadStream(filePath), response);

```