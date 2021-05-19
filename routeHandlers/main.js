var express = require('express');
const colors = require('colors');
var app = express();
var bodyParser = require('body-parser');
var config = require('../backend/config.json');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
var router = express.Router();
var ssn;
module.exports = router;
app.set('views', __dirname + './');
app.engine('pug', require('pug').__express);
app.set("view engine", "pug");
router.get('/', function(req, res) {
    res.render('home.pug');
})
