const express = require('express');
const routes = express.Router();
const Register = require('../models/registers')
const auth = require('../middleware/auth')
const authdash = require('../middleware/authdash')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
const { render } = require('ejs');
const nodemailer = require("nodemailer");
const Mailgen = require("mailgen");
const upload=require('../multer')
const cloudinary = require("../middleware/utils/cloudinary");

// image delete
routes.delete('/deleteImage/:imageId', async (req, res) => {
    const { imageId } = req.params;
    const token = req.cookies.jwt;
      const verify = jwt.verify(token, process.env.secretKey);
    try {
      // Find the user and remove the image with the specified _id
      const user = await Register.findById(verify._id);
      if (!user) {
        return res.status(404).send('User not found');
      }
  
      const imageIndex = user.image.findIndex((img) => img._id.toString() === imageId);
  
      if (imageIndex === -1) {
        return res.status(404).send('Image not found');
      }
  
      // Remove the image from the array
      user.image.splice(imageIndex, 1);
  
      // Save the updated user
      await user.save();
  
      res.status(204).send();
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
  });
// dashboard
routes.get('/dashboard', auth, async(req, resp) => {
  const token  =req.cookies.jwt;
        const verify=jwt.verify(token,process.env.secretKey)
        const user= await Register.findOne({_id:verify._id})
  resp.render("dashboard",{user})
});




routes.post('/dashboard', authdash, upload.single('image'), async (req, resp) => {
    try {
      const token = req.cookies.jwt;
      const verify = jwt.verify(token, process.env.secretKey);
  
      // Fetch the user's current data
      const user = await Register.findById(verify._id);
  
      if (!user) {
        return resp.status(401).send("User not found.");
      }
  
      // Handle updating additional details
      const { service, namehome, forValue, highlight, location, contact, latitude, longitude } = req.body;
  
      // Update the user's additional details if they are provided
      if (service) user.service = service;
      if (namehome) user.namehome = namehome;
      if (forValue) user.for = forValue;
      if (highlight) user.highlight = highlight;
      if (location) user.location = location;
      if (contact) user.contact = contact;
  
      // Store latitude and longitude in the user object
      if (latitude && longitude) {
        user.latitude = latitude;
        user.longitude = longitude;
      }
  
      // Handle uploading the image if it's provided
      if (req.file) {
        cloudinary.uploader.upload(req.file.path, async (err, result) => {
          if (err) {
            console.error(err);
            return resp.status(500).send("Upload failed.");
          }
  
          // Push the new image URL into the 'image' array
          user.image.push({ url: result.secure_url });
  
          // Save the updated user data
          await user.save();
  
          resp.render("dashboard", { user });
        });
      } else {
        // No new image uploaded, simply save the user's data
        await user.save();
        resp.render("dashboard", { user });
      }
    } catch (error) {
      console.error(error);
      resp.status(401).send("Login timeout. Please login.");
    }
  });
  
  


routes.get('/logout', (req, resp) => {
    resp.clearCookie('jwt')
    resp.redirect('/')
})
routes.get('/',async (req, resp) => {
    const details=await Register.find()
    try {
        resp.render('index', { details });
      } catch (error) {
        console.error(error);
        resp.status(500).send("Internal Server Error");
      }
});

routes.get('/user-details', async(req, resp) => {
    const userId = req.query.userId;
    const userDetails = await Register.findOne({_id:userId})
    resp.render('user-details', { userDetails });

});

routes.get('/login', (req, resp) => {
    resp.render('login')
})
routes.get('/register', (req, resp) => {
    resp.render('register')
})

routes.post('/register', async (req, resp) => {
    try {
        const password = req.body.pass
        const confirmpassword = req.body.repass
        if (password == confirmpassword) {
            const userdata = new Register({
                name: req.body.name,
                email: req.body.email,
                contact: req.body.contact,
                password: req.body.pass,
                confirmpassword: req.body.repass,

                //
                // // image:'nill'

            })

            const token = await userdata.generateAuthToken()
            // console.log("generatet token is:", token);

            resp.cookie("jwt", token, {
                expires: new Date(Date.now() + 10000000),
                httpOnly: true
            });
            const registered = await userdata.save()
            resp.status(201).render('register')
        } else {
            resp.send("pass not matching")
        }

    } catch (error) {
        resp.send(error)
        console.log("registerpage ka error post method");
    }
})

// login post
routes.post('/login', async (req, resp) => {
    const email = await req.body.email
    const password = await req.body.pass
    try {
        const useremail = await Register.findOne({ email: email })
        const ismatch = await bcrypt.compare(password, useremail.password)
        const token = await useremail.generateAuthToken()

        resp.cookie("jwt", token, {
            expires: new Date(Date.now() + 30000000),
            httpOnly: true
        });
        if (ismatch) {
            resp.status(201).redirect('/')
        } else {
            resp.send('invalid credential')
        }
    } catch (error) {
        resp.send("user not found")
    }

})

// forgot password

routes.get('/forgot-pass',(req,resp)=>{
resp.render('forgot-pass')

})
routes.post('/forgot-pass', async(req,resp)=>{
const email= await req.body.email;
const findinguser=await Register.findOne({email})
// resp.send(findinguser)
if (!email) {
    resp.send("email not registerd")
    return;
}
// generating token
const token = await findinguser.generateAuthToken()
// console.log("forgot",token);

// linkgenerating
const link=`http://localhost:3000/reset-pass/${findinguser._id}/${token}`


const transporter = nodemailer.createTransport({
    service: "gmail",
    // port: 587,
    // secure: false,
    auth: {
        user:process.env.semail,
        pass:process.env.epass
    },
    // tls: {
    //     ciphers:'SSLv3'
    // }
  });
let mailGenerater=new Mailgen({
    theme:"default",
    product:{
        name:"HUNTER",
        link:'https://mailgen.js/'
    }
})

let response={
    body:{
        name:findinguser.name,
        intro:"reset your password",
        table:{
            data:[
               { item :`click the link to reset your password ${link}`}
            ]
        }
    },
    outro:"Looking forward to do more buissness"

}

let mail=mailGenerater.generate(response)
// send mail with defined transport object
const info = await transporter.sendMail({
    from: 'rawtemithlesh52@gmail.com', // sender address
    to: findinguser.email, // list of receivers
    subject: "reset password link✔", // Subject line
    text: `this is your reset password link ${link}`, // plain text body
    html: mail, // html body
}).then(()=>{
    return resp.send("reset password link sended to your email")
}).catch(error =>{
    return resp.send("error occure in sending email")
})

// console.log(link);
})

routes.get('/reset-pass/:_id/:token', async (req, resp) => {
  const { _id, token } = req.params;
  const findinguser = await Register.findOne({ _id });
  const verify = jwt.verify(token, process.env.secretKey);
  resp.render('reset-pass', { email: findinguser.email });
})


routes.post('/reset-pass/:_id/:token', async (req, resp) => {
  const { _id, token } = req.params;
  let { password, password2 } = req.body;

  // Verify the token and update the password
  const verify = jwt.verify(token, process.env.secretKey);

  password = await bcrypt.hash(password, 12);
  password2 = await bcrypt.hash(password2, 12);

  // Update the password in the database
  const updateResult = await Register.updateOne({ _id }, { $set: { password, confirmpassword: password2 } });
  resp.json({ message: "Password successfully updated" });

});






module.exports = routes