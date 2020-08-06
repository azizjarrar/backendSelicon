const express = require("express");
const mongoose = require("mongoose");
const bodyparser = require("body-parser");
const app = express();
const morgan = require("morgan");
const ENV = require('dotenv')
const jwt = require('jsonwebtoken');
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
    app.use('/login',async (req,res)=>
    {
      if(req.body.username==process.env.secret_key && req.body.password==process.env.password){

        const token = await jwt.sign({Role:'admin'},process.env.tokenpassword,{ expiresIn: "15d" }, (err, token) => {
          res.status(res.statusCode).json({
              message:'login succeeded',
              role:'admin',
              token:token           
           })
       })
      }else{
        res.status(res.statusCode).json({
          "message": "mdp incorect",
      })
      }

    })
    app.use('/sendEmail',async (req,res)=>{
     
      var nodemailer = require('nodemailer');

      var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'tripelbil@gmail.com',
          pass: 'Jarrar280198'
        }
      });
      
      var mailOptions = {
        from: `${req.body.Nom} ${req.body.prenom}`,
        to: 'azizjarrar@gmail.com',
        subject: 'Sending Email',
        text: `
        Tel:${req.body.Telephone} 
        Email:${req.body.Email}
        Subject:${req.body.textArea}`
      };
      
      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          res.status(res.statusCode).json({
            "message": error,
        })
        } else {
          res.status(res.statusCode).json({
            "message": "Email sent",
        })
        }
      });
    })
    app.use((req, res) => {
      res.status(404).json({ error: "pagenotfound" });
    });
  }
);
module.exports = app;
