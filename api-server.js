  
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const helmet = require("helmet");
const jwt = require("express-jwt");
const jwksRsa = require("jwks-rsa");

const bodyParser = require('body-parser');

const asser = require("assert");
const { assert } = require("console");
const MongoClient = require('mongodb').MongoClient;
const mongo = require("mongodb"); 

const app = express();

app.use(express.json());  // for parsing application/json objects passed in POST bodies
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json())


const port = 7000 || process.env.API_PORT;
const appOrigin = process.env.APP_ORIGIN;
const audience = process.env.AUTH0_AUDIENCE;
const issuer = process.env.AUTH0_ISSUER;


const uri = "mongodb+srv://dbUser:456R7xzk@cluster0.mxdnt.mongodb.net/?retryWrites=true&w=majority";
const mongoClient = new MongoClient(uri,{ useNewUrlParser: true, useUnifiedTopology: true });


if (!issuer || !audience) {
  throw new Error("Please make sure that .env is in place and populated");
}

app.use(morgan("dev"));
app.use(helmet());
app.use(cors({ origin: appOrigin }));



const checkJwt = jwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `${issuer}.well-known/jwks.json`,
    handleSigningKeyError: (err, cb) => {
      if (err instanceof jwksRsa.SigningKeyNotFoundError) {
        return cb(new Error('This is bad'));
      }
      return cb(err);
    }
    
  }),

  audience: audience,
  issuer: issuer,
  algorithms: ["RS256"],
});



app.post("/api/user/update-data"/*, checkJwt*/, (req, res)=> {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');


    let username = req.body.user; 

    console.log(typeof username);

    console.log(username);

    let privateScheduleData = req.body;
  
 
    delete privateScheduleData.user

    return mongoClient.connect()
    .then(() => { 
        mongoClient.db("db-name").collection(username).insertOne(privateScheduleData);
        return res.status(201).send(privateScheduleData); // token here maybe?
    })
    .catch(err => {
        console.log("Error storing user\n",err);
        return res.status(500).send("Failed to store user info.");
    });
});

app.post("/api/public/update-data"/*, checkJwt*/, (req, res)=> {

  
  let username = req.body.user; 

    let publicScheduleData = req.body;
  
  
    delete publicScheduleData.user
    console.log(req.body);

 

    return mongoClient.connect()
    .then(() => { 
        mongoClient.db("db-name").collection("publicschedules").insertOne(publicScheduleData);
        return res.status(201).send(publicScheduleData); // token here maybe?
    })
    .catch(err => {
        console.log("Error storing user\n",err);
        return res.status(500).send("Failed to store user info.");
    });
});


app.get("/api/public/scheduleData", (req, res) => {

  return mongoClient.connect()
    .then( () => {
      const scheduleCollection = mongoClient.db("db-name").collection("publicschedules").find();

      return new Promise((resolve, reject) => {
        scheduleData = {};

        scheduleCollection.forEach( e => {
          console.log(e);
          scheduleData["scheduleDataInfo"] = e.scheduleDataInfo;
          scheduleData["scheduleData"] = e.scheduleData;
        }, 
        () => {   // callback executed after forEach
          scheduleCollection.close();
          
          if(scheduleData){
            console.log(scheduleData);
            resolve(scheduleData);  
          }
          else{
            reject("could not get data");
          }
        });
      })
      }).then( (scheduleData) => {
        return res.status(201).send(scheduleData);
      }).catch((error) => {
        console.log(error);
        return res.status(400).send();
      })
    .catch(error => {
      console.log("could not connect to db");
    });
});

app.get("/api/:username/scheduleData", (req, res) => {

  let username = req.params.username;

  return mongoClient.connect()
    .then( () => {
      const scheduleCollection = mongoClient.db("db-name").collection(username).find();

      return new Promise((resolve, reject) => {
        scheduleData = {};

        scheduleCollection.forEach( e => {
          scheduleData["scheduleDataInfo"] = e.scheduleDataInfo;
          scheduleData["scheduleData"] = e.scheduleData;
        }, 
        () => {   // callback executed after forEach
          scheduleCollection.close();
          
          if(scheduleData){
            console.log(scheduleData);
            resolve(scheduleData);  
          }
          else{
            reject("could not get data");
          }
        });
      })
      }).then( (scheduleData) => {
        return res.status(201).send(scheduleData);
      }).catch((error) => {
        console.log(error);
        return res.status(400).send();
      })
    .catch(error => {
      console.log("could not connect to db");
    });
});

//backend for lab4
const timetable = require("./timetabledata.json") ;


app.get('/api/subjectss', (req, res) => { 


res.send(timetable)

})





app.listen(port, () => console.log(`API Server listening on port ${port}`));

