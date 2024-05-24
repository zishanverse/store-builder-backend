require("dotenv").config();
const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const port = process.env.PORT;
const app = express();
const  { v4  } = require('uuid');
const cors = require("cors");
app.use(express.json());
const mysql = require('mysql2');

app.use(
    cors({
        "origin": "*",
  "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
  "preflightContinue": false,
  "optionsSuccessStatus": 204
    })
);

const url = `mysql://${process.env.MYSQLUSER}:${process.env.MYSQLPASSWORD}@${process.env.MYSQLHOST}:${process.env.MYSQLPORT}/${process.env.MYSQLDATABASE}`

const connection = mysql.createConnection(url);

  // Connect to MySQL
connection.connect((err) => {
    if (err) {
      console.error('Error connecting to MySQL: ' + err.stack);
      return;
    }
    console.log('Connected to MySQL as id ' + connection.threadId);
    app.listen(port, () => {
        console.log("server is running... :)");
      });
    const query = `SELECT * FROM appUser WHERE email_phone = 'zishan@gmail.com';`;
    connection.query(query, (err, result) => {
        if (err) throw err;
        console.log(result);
    })
});



app.post("/api/signup", async (request, response) => {
    const { email_phone, password, created_at} = request.body;
    const checkUserQuery = `SELECT * FROM appUser WHERE email_phone = '${email_phone}';`;
    connection.query(checkUserQuery, async (err, result) => {
        if (err) throw err;
        else {
            const pattern = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/;
            if (result.length !== 0) {
                response.status(400);
                response.send("User already exists");
            } else if ((!email_phone.match(pattern) || !email_phone.endsWith("@gmail.com")) && !Number.isInteger(parseInt(email_phone))) {        
                response.status(400);
                response.send("Invalid email address");
            }
            else if (Number.isInteger(parseInt(email_phone)) && !(email_phone.length ===10))  {
                response.status(400);
                response.send("Invalid phone number.");
            } else if (password.length < 8) {
                response.status(400);
                response.send("Password is too short");
            } else {
                const hashPassword = await bcrypt.hash(password, 10);
                const query = `
                    INSERT INTO appUser (user_site_id, email_phone, password, created_at)
                    VALUES (
                        '${v4()}',
                        '${email_phone}',
                        '${hashPassword}',
                        '${created_at}'
                    );`;
                connection.query(query, (err, result) => {
                    if (err) throw err;
                        connection.query(`SELECT * FROM appUser WHERE email_phone = '${email_phone}';`, (err, res) => {
                            if (err) throw err;
                            response.status(200);
                            response.send(res);
                        })
                })
            }
            
        }
    });
});

app.post("/login", async (request, response) => {
    const { email_phone, password } = request.body;
    const checkUserQuery = `SELECT * FROM appUser WHERE email_phone = '${email_phone}';`;
    connection.query(checkUserQuery, async(err, result) => {
        if (err) throw err;
        else {
            if (result.length === 0) {
                response.status(400);
                response.send("Invalid user");
            } else {
                const checkPassword = await bcrypt.compare(password, result[0].password);
            
                if (checkPassword === false) {
                  response.status(400);
                  response.send("Invalid password");
                } else {
                  const payload = { email_phone};
                  const jwtoken = jwt.sign(payload, "MY_SECRET");
                  response.send({ jwtToken: jwtoken, user: result });
                }
            }
        }
    });  
});

