const express = require("express");
const mongoose = require("mongoose");
const bodyparser = require("body-parser");
const app = express();
const morgan = require("morgan");
const ENV = require('dotenv')
ENV.config();
const tier_route = require('./api/routes/tier')
const items = require('./api/routes/items')
const pass ="silcion123"
const url ="mongodb+srv://silcion:"+pass+"@cluster0.xawtq.mongodb.net/<dbname>?retryWrites=true&w=majority";
mongoose.connect(
  url,
  { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true },
  async (err, cl) => {
    if (err) {
      console.log("error de connection=" + err);
      throw err;
    } else {
      console.log("connection");
    }
    mongoose.set("useFindAndModify", false);
    app.use((req, res, next) => {
      res.header("Access-Control-Allow-Origin", "*");
      res.header(
        "Access-Control-Allow-Headers",
        "Origin,X-Requested-With,Content-Type,Accept,Authorization"
      );
      if (req.method === "OPTIONS") {
        res.header("Access-Control-Allow-Methods", "PUT,POST,PATCH,DELETE,GET");
        return res.status(200).json({});
      }
      next();
    });
    app.use(bodyparser.urlencoded({ extended: true }));
    app.use(bodyparser.json());
    app.use(morgan("dev"));
    app.use("/tier", tier_route);
    app.use("/items",items)
    app.use('/uploads/Medias',express.static('./uploads/Medias'))
    app.use('/login',(req,res)=>
    {
      if(req.body.username==process.env.secret_key && req.body.password==process.env.password){
        res.status(res.statusCode).json({
          "message": "login",
      })
      }else{
        res.status(res.statusCode).json({
          "message": "mdp incorect",
      })
      }

    })
    app.use((req, res) => {
      res.status(404).json({ error: "pagenotfound" });
    });
  }
);
module.exports = app;
