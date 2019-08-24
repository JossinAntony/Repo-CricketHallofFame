const Express = require('express');
const request = require('request');
const bodyParser = require('body-parser');
const Mongoose = require('mongoose');

var app = new Express();

app.set('view engine', 'ejs');
app.use(Express.static(__dirname+'/public'));
app.use(bodyParser.urlencoded({extended:true}));

navlink = [
    {
        "title":"Batsmen",
        "link":"/viewBatsmen"
    },{
        "title":"Bowlers",
        "link":"/viewBowlers"
    },
    {
        "title":"Add player",
        "link":"/addPlayer"
    }
];

Mongoose.connect('mongodb://localhost:27017/cricketDB',{ useNewUrlParser: true }, (err, res) => {
    if (err) throw err;
    //console.log('Database online');
    });

//-----------Define dataschemas here--------------

const batsmenSchema = Mongoose.model('batsmans',{
    name:String,
    urating:String,
    status:String,
    country:String,
    role:String,
    style:String,
    tmatches:String,
    odimatches:String,
    t20matches:String,
    truns:String,
    odiruns:String,
    t20runs:String,
    tavg:String,
    odiavg:String,
    t20avg:String,
    trate:String,
    odirate:String,
    t20rate:String,
    t100:String,
    odi100:String,
    t20100:String,
    imgsrc:String,
    profile:String
});

const bowlersSchema = Mongoose.model('bowlers',{
    name:String,
    urating:String,
    status:String,
    country:String,
    style:String,
    tmatches:String,
    odimatches:String,
    t20matches:String,
    tballs:String,
    odiballs:String,
    t20balls:String,
    twkts:String,
    odiwkts:String,
    t20wkts:String,
    trate:String,
    odirate:String,
    t20rate:String,
    tavg:String,
    odiavg:String,
    t20avg:String,
    imgsrc:String,
    profile:String
});
//-------------------------------
//save batsmen entriesAPI
app.post('/saveBatsman', (req,res)=>{
    var item = req.body;
    var batsman = batsmenSchema(item);
    batsman.save((error,data)=>{
        if(error){
            throw error;
        }else{
            res.send('new object created @' + data);
        }
    })
});
//-----Retrieve All Batsmen---------------

//retrieveallbatsmenAPI
app.get('/retrieveBatsmenAPI',(req,res)=>{
    var retrieve = batsmenSchema.find((error,data)=>{
        if (error){
            throw error;
            res.send(error);
        }else{
            res.send(data);
        }
    })
});

//Retrieve Batsmen APILInk
const retrieveBatsmenAPILink = 'http://localhost:3046/retrieveBatsmenAPI'

//retrieveallbatsmen set view
app.get('/',(req,res)=>{
    request(retrieveBatsmenAPILink,(error,response,body)=>{
        if (error){
            throw error;
            res.send(error);
        }else {
            data = JSON.parse(body);
            res.render('viewBatsmen',{nav:navlink, title: "Batsmen", batsmans:data })
        }
    })
});

app.get('/viewBatsmen',(req,res)=>{
    request(retrieveBatsmenAPILink,(error,response,body)=>{
        if (error){
            throw error;
            res.send(error);
        }else {
            var data = JSON.parse(body);
            res.render('viewBatsmen',{nav:navlink, title: "Batsmen", batsmans:data })
        }
    })
});
//-------------------------------------------
//--------Save Bowlers-------------------
//save batsmen entriesAPI
app.post('/saveBowler', (req,res)=>{
    var item = req.body;
    var bowler = bowlersSchema(item);
    bowler.save((error,data)=>{
        if(error){
            throw error;
        }else{
            res.send('new object created @' + data);
        }
    })
});
//--------Retrive Bowlers--------------------
//RetriveBowlersAPI
app.get('/retrieveBowlersAPI',(req, res)=>{
    bowlersSchema.find((error,data)=>{
        if (error){
            throw error;
            res.send(data);
        }else{
            res.send(data);
        }
    });
});

//RetrieveBowlersAPILink
const retrieveBowlersAPILink = 'http://localhost:3046/retrieveBowlersAPI'

//RetrieveBowlersfunction
app.get('/viewBowlers',(req,res)=>{
    request(retrieveBowlersAPILink,(error,response,body)=>{
        if(error){
            throw error;
            res.send(error);
        }else{
            var data = JSON.parse(body);
            res.render('viewBowlers',{nav:navlink, title:'Bowlers', bowlers:data})
        }
    });
});
//---------------------------------------
//-------Add players to database--------------

//set selection view
app.get('/addPlayer',(req,res)=>{
    res.render('addPlayer',{nav:navlink, title:"Add Player"});
});

app.get('/addBatsman',(req,res)=>{
    res.render('addBatsman',{nav:navlink, title:"Add Batsman"});
});

app.get('/addBowler',(req,res)=>{
    res.render('addBowler',{nav:navlink, title:"Add Bowler"});
})
//---------------------------------------
app.listen(process.env.PORT || 3046,()=>{
    console.log("Server running at http://localhost:3046")
});