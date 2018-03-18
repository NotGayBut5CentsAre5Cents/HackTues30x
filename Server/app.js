var express = require('express')
const path = require('path')
var app = express()
var ejs = require('ejs');
var bodyParser = require('body-parser')

app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));

app.listen(3000, () =>
    console.log('Example app listening on port 3000!'));

app.get('/', function (req, res) {
    res.render("index")
});

app.get('/summarize', function (req, res) {
    res.render("summarize")
})

app.post('/upload', function (req, res) {
    text = req.body.text
    ext = req.body.sender
    console.log(text)
    //fs.appendFileSync(path.join(__dirname, '../datasets/liver.csv'), "\n" + result.join(','));
    var spawn = require("child_process").spawn;
    var process = spawn('C:\\ProgramData\\Anaconda3\\python.exe', [path.join(__dirname, "../models/modelLoader.py"), "model", text]);

    process.stdout.on('data', function (data) {
        console.log(data.toString())
        if(ext == "ext") {
            res.send(data);
        }else {
            res.render('result', {
                text: data
           });
        }
    });

    process.stderr.on('data', function (data) {
        console.log(data.toString())
    });


});