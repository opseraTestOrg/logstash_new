// require('./server/data/db.js');
var express = require('express'); 
var app = express();
var path = require('path');
var routes = require('./server/routes/api.js');
var bodyParser = require('body-parser');

app.set('port', 3050);
app.use(express.static(path.join(__dirname, 'dist')));
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({ extended: false, limit : '50mb' }));
app.get('/', (req, res) => {
    res.send('Node API is up and running on port 3050...\n');
  });
  
app.use('/api', routes);

var server = app.listen(app.get('port'), function(){
    var port = server.address().port;
    console.log("api on port" + port);
});
