# ea-session-storage

`npm install --save ea-session-storage`

## Usage with express
```javascript
var http = require('http');
var express = require('express');
var storage = require('ea-session-storage');

var app=express();
var PORT=5555;

//bind to some route, providing a session secret, and cookie expiration date
app.use('/storage', storage({sessionSecret:'hello kitty',expireDays:90}));

//start server 
http.createServer(app).listen(PORT);
```
## In the browser
```html
<!-- Get (automatically generated) Client API -->
<script src="http://localhost:5555/storage/client.js"></script>
<script>
(async()=>{
	//set storage.baseURI to asbolute path to the storage server api 
        storage.baseURI="http://localhost:5555/storage/";
        await storage.setItem('person',{jenny:13});
        console.log(await storage.getItem('person'));
})()
</script>
```
