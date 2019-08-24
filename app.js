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
        "title":"Admin Panel",
        "link":"/adminPanel"
    },
    {
        "title":"Trial",
        "link":"/trial"
    }
];

pagename = {'pagename':'Cricket Hall of Fame'};

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
            res.render('viewBatsmen',{nav:navlink, title: "Batsmen",pageName:pagename, batsmans:data })
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
            res.render('viewBatsmen',{nav:navlink, title: "Batsmen",pageName:pagename, batsmans:data })
        }
    })
});
//-------------------------------------------
//--------Retrieve single batsman-----------
//Retrieve single batsman API
app.get('/retrieveBatsmanAPI',(req,res)=>{
    id = req.query.q;
    batsmenSchema.find({_id:id},(error,data)=>{
        if (error){
            throw error;
            res.send(error);
        }else{
            res.send(data);
        }
    })
})

//Retrieve single batsman API LInk
const retrieveBatsmanAPILink = 'http://localhost:3046/retrieveBatsmanAPI'

//Retrieve single batsman view
app.get('/retrieveBatsman/:id',(req,res)=>{
    var id= req.params.id;
    request(retrieveBatsmanAPILink+'/?q='+id,(error,response,body)=>{
        if (error){
            throw error;
            res,send(error);
        }else{
            data = JSON.parse(body);
            res.render('viewBatsman',{nav:navlink, batsman:data,pageName:pagename,title:"Batsman"});
        }
    })
});

//set view for search for edit Batsman
app.get('/searchForEditBatsman',(req,res)=>{
    res.render('searchForEditBatsman', {nav:navlink, pageName:pagename,title:"Search"});
});

//Retrieve batsman for edit
app.post('/retrieveBatsmanforEditAPI',(req,res)=>{
    var sname = req.body.sbatsman;
    batsmenSchema.find({name:sname},(error,data)=>{
        if (error){
            throw error;
            res.send(error);
        }else{
            if(data.length < 1){
                res.send('<script>alert("Searched entry does not exist in Database, please try again!")</script>')
            }else{
            res.render('viewBatsmanForEdit',{nav:navlink, pageName:pagename,title:"Search", batsman:data});
        }
        }
    })
});

//update Batsman
app.post('/updateBatsman/:id',(req,res)=>{
    var batsman = req.body;
    var id = req.params.id;
    batsmenSchema.update({_id:id},{$set:{urating:batsman.urating,
        name:batsman.name,
        status:batsman.status,
        country:batsman.country,
        role:batsman.role,
        style:batsman.style,
        tmatches:batsman.tmatches,
        odimatches:batsman.odimatches,
        t20matches:batsman.t20matches,
        truns:batsman.truns,
        odiruns:batsman.odiruns,
        t20runs:batsman.t20runs,
        tavg:batsman.tavg,
        odiavg:batsman.odiavg,
        t20avg:batsman.t20avg,
        trate:batsman.trate,
        odirate:batsman.odirate,
        t20rate:batsman.t20rate,
        t100:batsman.t100,
        odi100:batsman.odi100,
        t20100:batsman.t20100,
        imgsrc:batsman.imgsrc,
        profile:batsman.profile
    }},(error,data)=>{
        if(error){
            throw error;
            res.send (error);
        }else{
            res.send('<script>alert("Entry updated!")</script>');
        }
    });
    });
//////////////
//set view for search for Delete Batsman
app.get('/searchForDeleteBatsman',(req,res)=>{
    res.render('searchForDeleteBatsman', {nav:navlink, pageName:pagename,title:"Search"});
});

//Retrieve batsman for edit
app.post('/retrieveBatsmanforDeleteAPI',(req,res)=>{
    var sname = req.body.sbatsman;
    batsmenSchema.find({name:sname},(error,data)=>{
        if (error){
            throw error;
            res.send(error);
        }else{
            if(data.length < 1){
                res.send('<script>alert("Searched entry does not exist in Database, please try again!")</script>')
            }else{
            res.render('viewBatsmanForDelete',{nav:navlink, pageName:pagename,title:"Search", batsman:data});
        }
        }
    })
});

//delete Batsman
app.post('/deleteBatsman/:id',(req,res)=>{
    var batsman = req.body;
    var id = req.params.id;
    batsmenSchema.remove({_id:id},(error,data)=>{
        if(error){
            throw error;
            res.send (error);
        }else{
            res.send('<script>alert("Entry Deleted!")</script>');
        }
    });
    });
//--------------------------------------

//--------Save Bowlers-------------------
//save bowlers entriesAPI
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
            res.render('viewBowlers',{nav:navlink, title:'Bowlers',pageName:pagename, bowlers:data})
        }
    });
});
//---------------------------------------
//--------Retrieve single Bowler-----------
//Retrieve single batsman API
app.get('/retrieveBowlerAPI',(req,res)=>{
    id = req.query.q;
    bowlersSchema.find({_id:id},(error,data)=>{
        if (error){
            throw error;
            res.send(error);
        }else{
            res.send(data);
        }
    })
})

//Retrieve single bowler API LInk
const retrieveBowlerAPILink = 'http://localhost:3046/retrieveBowlerAPI'

//Retrieve single bowler view
app.get('/retrieveBowler/:id',(req,res)=>{
    var id= req.params.id;
    request(retrieveBowlerAPILink+'/?q='+id,(error,response,body)=>{
        if (error){
            throw error;
            res,send(error);
        }else{
            data = JSON.parse(body);
            res.render('viewBowler',{nav:navlink, bowler:data,pageName:pagename,title:"Bowler"});
        }
    })
});

//set view for search for edit Bowler
app.get('/searchForEditBowler',(req,res)=>{
    res.render('searchForEditBowler', {nav:navlink, pageName:pagename,title:"Search"});
});

//Retrieve bowler for edit
app.post('/retrieveBowlerforEditAPI',(req,res)=>{
    var sname = req.body.sbowler;
    bowlersSchema.find({name:sname},(error,data)=>{
        if (error){
            throw error;
            res.send(error);
        }else{
            if(data.length < 1){
                res.send('<script>alert("Searched entry does not exist in Database, please try again!")</script>')
            }else{
            res.render('viewBowlerForEdit',{nav:navlink, pageName:pagename,title:"Search", bowler:data});
        }
        }
    })
});

//update Bowler
app.post('/updateBowler/:id',(req,res)=>{
    var bowler = req.body;
    var id = req.params.id;
    bowlersSchema.update({_id:id},{$set:{urating:bowler.urating,
        name:bowler.name,
        status:bowler.status,
        country:bowler.country,
        style:bowler.style,
        tmatches:bowler.tmatches,
        odimatches:bowler.odimatches,
        t20matches:bowler.t20matches,
        tballs:bowler.tballs,
        odiballs:bowler.odiballs,
        t20balls:bowler.t20balls,
        twkts:bowler.twkts,
        odiwkts:bowler.odiwkts,
        t20wkts:bowler.t20wkts,
        trate:bowler.trate,
        odirate:bowler.odirate,
        t20rate:bowler.t20rate,
        tavg:bowler.tavg,
        odiavg:bowler.odiavg,
        t20avg:bowler.t20avg,
        imgsrc:bowler.imgsrc,
        profile:bowler.profile
    }},(error,data)=>{
        if(error){
            throw error;
            res.send (error);
        }else{
            res.send('<script>alert("Entry updated!")</script>');
        }
    });
    });

//---------------------------------------------
//-------Add players to database--------------

//set selection view
app.get('/adminPanel',(req,res)=>{
    res.render('adminPanel',{nav:navlink,pageName:pagename, title:"Admin Panel"});
});

app.get('/addBatsman',(req,res)=>{
    res.render('addBatsman',{nav:navlink,pageName:pagename, title:"Add Batsman"});
});

app.get('/addBowler',(req,res)=>{
    res.render('addBowler',{nav:navlink,pageName:pagename, title:"Add Bowler"});
})
//---------------------------------------
//-----trial--------------------
app.get('/trial',(req,res)=>{
    res.render('trial',{nav:navlink,pageName:pagename, title:"Trial", value:{'title':'placeholdervalue'}});
});

app.post('/trialaction',(req,res)=>{
    var item = req.body;
    //console.log(item);
});

//-----------------------------
app.listen(process.env.PORT || 3046,()=>{
    console.log("Server running at http://localhost:3046")
});