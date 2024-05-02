require("dotenv").config();
const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const port = process.env.PORT;
const app = express();
app.use(express.json());
const mysql = require('mysql');





const connection = mysql.createConnection({
    host: process.env.DB_HOST, // or your MySQL host
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});
  
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
    const query = `SELECT * FROM user WHERE email_phone = 'zishanverse@gmail.com';`;
    connection.query(query, (err, result) => {
        if (err) throw err;
        console.log(result[0].id);
    })
});


app.post("/api/signup", async (request, response) => {
    const { email_phone, password, created_at} = request.body;
    console.log(password);
    const checkUserQuery = `SELECT * FROM user WHERE email_phone = '${email_phone}';`;
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
                    INSERT INTO user (email_phone, password, created_at)
                    VALUES (
                        '${email_phone}',
                        '${hashPassword}',
                        '${created_at}'
                    );`;
                connection.query(query, (err, result) => {
                    if (err) throw err;
                    response.status(200);
                    response.send("User created successfully");
                })
            }
            
        }
    });
});

app.post("/login/", async (request, response) => {
    const { email_phone, password } = request.body;
    const checkUserQuery = `SELECT * FROM user WHERE email_phone = '${email_phone}';`;
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
                  response.send({ jwtToken: jwtoken });
                }
            }
        }
    });  
});