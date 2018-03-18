var express = require('express')
var app = express()
var ejs = require('ejs');
var bodyParser = require('body-parser')

app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

app.set('view engine', 'ejs');


app.listen(3000, () =>
    console.log('Example app listening on port 3000!'));

app.get('/', function (req, res) {
    res.render("homepage")
});

app.post('/upload', function (req, res) {
    text = req.params['text']
    //fs.appendFileSync(path.join(__dirname, '../datasets/liver.csv'), "\n" + result.join(','));
    var spawn = require("child_process").spawn;
    var process = spawn('python3', [path.join(__dirname, "../models/modelLoader.py"), "model"].concat(text));

    process.stdout.on('data', function (data) {
        console.log(data.toString())
        res.render('result', {
            text: result
        });
    });

    process.stderr.on('data', function (data) {
        console.log(data.toString())
    });


});

app.post("/sum", function (req, res) {
    console.log(req.body.text);
    res.send(req.body.text)
});