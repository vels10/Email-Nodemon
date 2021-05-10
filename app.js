const express = require('express');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const nodemailer = require("nodemailer");
const path = require('path');
require ('custom-env').env('dev', '/home/vels10/WORK/May-21/EmailForm');


const app = express();

console.log("HIIIIIIIIIIIIIIIIIII,",process.env.EMAIL);
console.log("HIIIIIIIIIIIIIIIIIII,",process.env.PASS);

app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

app.use('/public', express.static(path.join(__dirname, '/public')));


app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());


app.get('/', (req, res)=>{
    res.render("contact",{layout: false})
});

app.post('/send', (req, res)=>{
    const output = `
        <p>You have a new contact request</p>
        <h3>Contact Details</h3>
        <ul>  
        <li>Name: ${req.body.name}</li>
        <li>Company: ${req.body.company}</li>
        <li>Email: ${req.body.email}</li>
        <li>Phone: ${req.body.phone}</li>
        </ul>
        <h3>Message</h3>
        <p>${req.body.message}</p>
    `;
    
    // Nodemailer BoilerPlate 
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL, // generated ethereal user
            pass: process.env.PASS  // generated ethereal password
        },
        tls:{
        rejectUnauthorized:false
        }
  });

    // setup email data with unicode symbols
    let mailOptions = {
        from: '"Nodemailer Contact" <velssss10@gmail.com>', // sender address
        to: 'velkumaran34@gmail.com', // list of receivers
        subject: 'Node Contact Request', // Subject line
        text: 'Hello world?', // plain text body
        html: output // html body
    };

  // send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Message sent: %s', info.messageId);   
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
        res.render('contact', {msg:'Email has been sent'}, ()=> {layout:false});
    });
});

app.listen(3000, ()=>console.log("Server Started.."));