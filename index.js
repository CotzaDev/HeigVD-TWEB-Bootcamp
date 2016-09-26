var express = require('express');
var app = express();
var useragent = require('useragent');

useragent(true);

app.use('/assets', express.static('assets'));

app.set('views', './views');
app.set('view engine', 'jade');

app.get('/', function (req, res) {
  res.render('index', { title: 'TWEB App', message: 'Welcome !', useragent: useragent.parse(req.headers['user-agent'])});
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});
