const express = require("express");
const app = express();
const bodyparser = require('body-parser');
const mongoose = require('mongoose');
mongoose.set('strictQuery', true);

mongoose.connect(process.env.MONGO_URI,(error)=>{
    if(error) console.log(error);
    else console.log("Database Connected");
})
app.use(bodyparser.urlencoded({extended : false}));

const contestantmodel = mongoose.Schema({
    index : Number,
    name : String,
    votes : Number,
    
})

const contestantvote = mongoose.model("contestantvote",contestantmodel);

app.use(express.static('public'));
app.set('view engine','ejs');
app.get("/",(req,res)=>{
    contestantvote.find((err,contestantfromdb)=>{
        console.log(contestantfromdb.length)
        res.render("votepage",{name : contestantfromdb});
    })
   
})
app.post('/vote',(req,res)=>{
    
    var checkedbody = parseInt(req.body.contestant);
    console.log(checkedbody);
    
    contestantvote.findOne({index : checkedbody},(err,contestantfromdb)=>{
        if(err){
            console.log(err);
        }else{
            console.log(contestantfromdb)
            let vote = contestantfromdb.votes;
            vote++;
          
            console.log(vote);
           const query = contestantvote.findOneAndUpdate({index: checkedbody},{votes : vote},(err,contestantfromdb)=>{
            console.log(contestantfromdb)
           })
           
        }
        contestantvote.find((err,contestantfromdb)=>{
            console.log(contestantfromdb.length)
            res.render("voteresult",{name : contestantfromdb});
        })
      
    })
 
})

app.listen(process.env.PORT || 7000,(error)=>{
 if(error)
 console.log(error);
 else
 console.log("Running Successfully!!");
})
