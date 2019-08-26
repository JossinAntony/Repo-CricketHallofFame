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
    }
];

pagename = {'pagename':'Cricket Hall of Fame'};

Mongoose.connect('mongodb://localhost:27017/cricketdb',{ useNewUrlParser: true }, (err, res) => {
    if (err) throw err;
    //console.log('Database online');
    });

    btsman=[{
        "name" : "Sachin Tendulkar",
        "urating" : "4"
    },
    {
        "name" : "Mahendra Singh Dhoni",
        "urating" : "3.5"
    },
    {
        "name" : "Brian Lara",
        "urating" : "4.5"
    },
    {
        "name" : "Ricky Ponting",
        "urating" : "3.5"
    },
    {
        "name" : "Eoin Morgan",
        "urating" : "3" 
    },
    {
        "name" : "Virat Kohli",
        "urating" : "3.5"
    },
    {
        "name" : "Imam-ul-Haq",
        "urating" : "2"
    },
    {
        "name" : "Gary Kirsten",
        "urating" : "3.5"
    },
    {
        "name" : "Alistair Campbell",
        "urating" : "1"
    }];




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

const CricketModel= Mongoose.model("usersignups",{      //collection is usersignups
    uemail:String,
    uname:String,
    upass:String,
    ucpass:String,
    ustatus:{
        type:String,
        default:"0"
      }
    
});
//creating a route named index for Homepage
app.get('/',(req,res)=>{                
    res.render('index',{pageName:pagename});
});
//creating a route named login for loginpage
app.get('/login',(req,res)=>{           
    res.render('login',{pageName:pagename});
});
//creating a route named signup for signup
app.get('/signup',(req,res)=>{          
    res.render('signup',{pageName:pagename});
});

app.get('/home',(req,res)=>{          
    res.render('home');
});
app.get('/adminlogin',(req,res)=>{                
    res.render('admin login',{pageName:pagename});
});
app.get('/',(req,res)=>{          
    res.render('logout');
});
app.get('/adminAPI',(req,res)=>{
    var item1 = req.query.uemail;
    var item2 = req.query.upass;
    var result = CricketModel.find({$and:[{uemail:item1},{upass:item2}]},(error,data)=>{
        if(error)
        {
            throw error;
            res.send(error);
        }
        else
        {
            res.send(data);
        }
        
    });
});
const API5 = "http://localhost:4032/adminAPI";
app.post('/kmslogin',(req,res)=>{
    var item1 = req.body.uemail;
    var item2 = req.body.upass;
    request(API5+"/?uemail="+item1+"&&upass="+item2,(error,response,body)=>{
        var data = JSON.parse(body);
        const userdata = data;
        console.log(data);
        if(data.length>0){
            if(item1==data[0].uemail && item2==data[0].upass)
            {
                //res.send(data.euname);
                if(item1=="admin@gmail.com" && item2=="admin123")
                {
                  res.render('adminPanel');
                }
                else
                {
                  if(data[0].ustatus != "1")
                  {
                    res.send("<script>alert('Admin not approved to LogIn')</script><script>window.location.href='/'</script>");
                  }
                  else
                  {
                    res.render('index',{data:data[0]});
                  }
                 
                }
            }
        }
    });
});
  

//for inserting data towards the database cricketdb
app.post('/readlogin',(req,res)=>{         
    var items=req.body;
    res.render('readlogin',{item:items});
});

//this is an API(loginAPI) to retrieve values from the database cricketdb
app.get('/loginAPI',(req,res)=>{
    var item1 = req.query.uname;
    var item2 = req.query.upass;
    var result = CricketModel.find({$and:[{uname:item1},{upass:item2}]},(error,data)=>{
        if(error)
        {
            throw error;
            res.send(error);
        }
        else
        {
            res.send(data);
        }
        
    });
});

//1) --> Below code says that a route '/viewlogin' is created. 
//2) --> Then a request is gone to API.
//3) --> Now the API(Name of API is '/loginAPI') runs its own code. 


const API = "http://localhost:4032/loginAPI"

app.post('/userlogin',(req,res)=>{
    var item1 = req.body.uname;
    var item2 = req.body.upass;
    request(API+"/?uname="+item1+"&&upass="+item2,(error,response,body)=>{
        var data = JSON.parse(body);
        console.log(data);
        if(data.length>0){
            if(item1==data[0].uname && item2==data[0].upass)
            {
                res.render('viewBatsmen',{nav:navlink, title: "Batsmen",pageName:pagename, batsmans:data });
                res.render('viewBowlers',{nav:navlink, title:'Bowlers',pageName:pagename, bowlers:data});
                // res.send("<script>alert('Login Successfull')</script><script>window.location.href='/login'</script>");
            }
        }
        else{
            res.send("<script>alert('Login unSuccessfull')</script><script>window.location.href='/login'</script>");
            
        }
     });
     
});


//for inserting data towards the database cricketdb
app.post('/readsignup',(req,res)=>{
    var items=req.body;
    res.render('readsignup',{item:items});
});

//this is an API(userall) to retrieve values from the database cricketdb
app.get('/userall',(req,res)=>{

    var result = CricketModel.find((error,data)=>{
        if(error)
        {
            throw error;
            res.send(error);
        }
        else
        {
            res.send(data);
        }
    });
});

//1) --> Below code says that a route '/userall' is created. 
//2) --> Then a request is gone to API.
//3) --> Now the API(Name of API is '/userall') runs its own code.
//4) --> /view is display content signupdetails


const API2 = "http://localhost:4032/userall";
app.get('/view',(req,res)=>{

    request(API2,(error,response,body)=>{

if(error)
{
    throw error;
    console.log("Error ::;;;;; "+error);
}

        var data = JSON.parse(body);
        res.render('signupview',{data:data});
    });
});

app.post('/usersignup',(req,res)=>{
    var user = new CricketModel(req.body);
    var result = user.save((error,data)=>{
        if(error)
        {
            throw error;
            res.send(error);
        }
        else
        {
            res.send("<script>alert('User Successfully Signup')</script><script>window.location.href='/signup'</script>");
        }
    });

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
const retrieveBatsmenAPILink = 'http://localhost:4032/retrieveBatsmenAPI'

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
const retrieveBatsmanAPILink = 'http://localhost:4032/retrieveBatsmanAPI'

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
const retrieveBowlersAPILink = 'http://localhost:4032/retrieveBowlersAPI'

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
const retrieveBowlerAPILink = 'http://localhost:4032/retrieveBowlerAPI'

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
    //////////////
//set view for search for Delete Bowler
app.get('/searchForDeleteBowler',(req,res)=>{
    res.render('searchForDeleteBowler', {nav:navlink, pageName:pagename,title:"Search"});
});

//Retrieve batsman for edit
app.post('/retrieveBowlerforDeleteAPI',(req,res)=>{
    var sname = req.body.sbowler;
    bowlersSchema.find({name:sname},(error,data)=>{
        if (error){
            throw error;
            res.send(error);
        }else{
            if(data.length < 1){
                res.send('<script>alert("Searched entry does not exist in Database, please try again!")</script>')
            }else{
            res.render('viewBowlerForDelete',{nav:navlink, pageName:pagename,title:"Search", bowler:data});
        }
        }
    })
});

//delete Batsman
app.post('/deleteBowler/:id',(req,res)=>{
    var bowler = req.body;
    var id = req.params.id;
    bowlersSchema.remove({_id:id},(error,data)=>{
        if(error){
            throw error;
            res.send (error);
        }else{
            res.send('<script>alert("Entry Deleted!")</script>');
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
    res.render('trial',{nav:navlink,pageName:pagename,Rating:{rating:'1.5'}, Batsman:btsman, title:"Trial", value:{'title':'placeholdervalue'}});
});

app.post('/trialaction',(req,res)=>{
    var item = req.body;
    //console.log(item);
});

//update user rating API

app.post('/submitRatingBatsman',(req,res)=>{
    var data = req.body;
    var star = data.sRating;
    var id = data.id;
    console.log(star);
    console.log(id);
    batsmenSchema.update({_id:id},{$set:{urating:star}},(error,data)=>{
        if(error){
            throw error;
            res.send (error);
        }else{
            //res.send('<script>alert("Entry updated!")</script>');
        }
    });
    res.send({status:'status', data:'data', xhr:'xhr'});
});

app.post('/submitRatingBowler',(req,res)=>{
    var data = req.body;
    var star = data.sRating;
    var id = data.id;
    console.log(star);
    console.log(id);
    bowlersSchema.update({_id:id},{$set:{urating:star}},(error,data)=>{
        if(error){
            throw error;
            res.send (error);
        }else{
            //res.send('<script>alert("Entry updated!")</script>');
        }
    });
    res.send({status:'status', data:'data', xhr:'xhr'});
});

//-----------------------------
app.listen(process.env.PORT || 4032,()=>{
    console.log("Server running at http://localhost:4032");
});
