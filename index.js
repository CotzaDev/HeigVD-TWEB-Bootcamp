var express = require('express');
var app = express();
var useragent = require('useragent');

useragent(true);

app.use('/assets', express.static('assets'));

app.set('port', (process.env.PORT || 5000));
app.set('views', './views');
app.set('view engine', 'jade');

app.get('/', function (req, res) {
  res.render('index', { title: 'TWEB App', message: 'Welcome !', useragent: useragent.parse(req.headers['user-agent'])});
});

app.listen(app.get('port'), function () {
  console.log('Node app is running on port', app.get('port'));
});
