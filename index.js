var express = require('express');
var bodyParser = require('body-parser');
var app = express();

app.use(bodyParser.json());
app.use('/', express.static('public'));
app.use('/api', require('./src/api'));

app.listen(process.env.PORT, function() {
  console.log('Oh lala! ' + process.env.PORT);
});
