const Express = require("express");
const Mongoose = require('mongoose');

var request = require('request');
var bodyParser = require('body-parser');

var app = new Express();

app.set('view engine','ejs');

app.use(Express.static(__dirname+"/public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

Mongoose.connect("mongodb://localhost:27017/cricketdb"); // database name cricketdb

const CricketModel= Mongoose.model("usersignups",{      //collection is usersignups
    uemail:String,
    uname:String,
    upass:String,
    ucpass:String
});
//creating a route named index for Homepage
app.get('/',(req,res)=>{                
    res.render('index');
});
//creating a route named login for loginpage
app.get('/login',(req,res)=>{           
    res.render('login');
});
//creating a route named signup for signup
app.get('/signup',(req,res)=>{          
    res.render('signup');
});

app.get('/home',(req,res)=>{          
    res.render('home');
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


const API = "http://localhost:3015/loginAPI"

app.post('/userlogin',(req,res)=>{
    var item1 = req.body.uname;
    var item2 = req.body.upass;
    request(API+"/?uname="+item1+"&&upass="+item2,(error,response,body)=>{
        var data = JSON.parse(body);
        console.log(data);
        if(data.length>0){
            if(item1==data[0].uname && item2==data[0].upass)
            {
                res.send("<script>alert('Login Successfull')</script><script>window.location.href='/login'</script>");
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


const API2 = "http://localhost:3015/userall";
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

app.listen(process.env.PORT || 3015,()=>{
    console.log("Server running on port::http://localhost:3015");
});

