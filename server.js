var express = require('express');
var app = express();

app.use('/', express.static('build'));

app.set('port', (process.env.PORT || 5000));

app.get('/api', function (req, res) {
  console.log('ok');
});

app.listen(app.get('port'), function () {
  console.log('Node app is running on port', app.get('port'));
});
