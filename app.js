const Express = require('express');
const request = require('request');
const bodyParser = require('body-parser');
const Mongoose = require('mongoose');

var app = new Express();

app.set('view engine', 'ejs');
app.use(Express.static(__dirname+'/public'));


Mongoose.connect('mongodb://localhost:27017/cricketDB')

app.get('/',(req,res)=>{
    res.render('index');
});

app.listen(process.env.PORT || 3046,()=>{
    console.log("Server running at http://localhost:3046")
});