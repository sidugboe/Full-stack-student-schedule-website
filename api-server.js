require("dotenv").config();

const client = require('mongodb').MongoClient();

const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const helmet = require("helmet");
const jwt = require("express-jwt");
const jwksRsa = require("jwks-rsa");

const app = express();

const port = 7000 || process.env.API_PORT;
const appOrigin = process.env.APP_ORIGIN;
const audience = process.env.AUTH0_AUDIENCE;
const issuer = process.env.AUTH0_ISSUER;

const url 

const router = express.Router()




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
  }),

  audience: audience,
  issuer: issuer,
  algorithms: ["RS256"],
});

app.get("/api/messages/public-message", (req, res) => {
  res.send({
    message: "The API doesn't require an access token to share this message.",
  });
});

app.get("/api/messages/protected-message", checkJwt, (req, res) => {
  res.send({
    message: "The API successfully validated your access token.",
  });
});  





app.post("/api/user/update-data", checkJwt, (req, res)=> {

  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:7000')
  // user specific data to be sent to user specific collection
    let userData = req.body;
  // * might need to stringify data 
      // todo

  // write data to USER SPECIFIC collection (will create if one not existing)
    return mongoClient.connect()
    .then(() => {                  //replace this with username
        mongoClient.db("db-name").collection("user").insertOne(userData);
        return res.status(201).send(body); // token here maybe?
    })
    .catch(err => {
        console.log("Error storing user\n",err);
        return res.status(500).send("Failed to store user info.");
    });
});





app.listen(port, () => console.log(`API Server listening on port ${port}`));

