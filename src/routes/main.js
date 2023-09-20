const express = require('express');
const routes = express.Router();
const Register = require('../models/registers')
const sendmsg = require('../models/sendmsg')
const auth = require('../middleware/auth')
const authdash = require('../middleware/authdash')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
const { render } = require('ejs');
const nodemailer = require("nodemailer");
const Mailgen = require("mailgen");
const upload = require('../multer')
const cloudinary = require("../middleware/utils/cloudinary");


// image delete
routes.delete('/deleteImage/:imageId', async (req, res) => {
  const { imageId } = req.params;
  const token = req.cookies.jwt;
  const verify = jwt.verify(token, process.env.secretKey);

  try {
    const user = await Register.findById(verify._id);
    if (!user) {
      return res.status(404).send('User not found');
    }

    const imageIndex = user.image.findIndex((img) => img._id.toString() === imageId);
    if (imageIndex === -1) {
      return res.status(404).send('Image not found');
    }

    // Remove the image URL from the user's profile
    user.image.splice(imageIndex, 1);
    await user.save();

    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});



// dashboard--------------------------------------->>>>>>>>>>>>>>>>>>>>>>>>>>
routes.get('/dashboard', auth, async (req, resp) => {
  const token = req.cookies.jwt;
  const verify = jwt.verify(token, process.env.secretKey)
  const user = await Register.findOne({ _id: verify._id })
  resp.render("dashboard", { user })
});

const MAX_IMAGES = 5;

routes.post('/dashboard', authdash, upload.array('image', MAX_IMAGES), async (req, resp) => {
  try {
    const token = req.cookies.jwt;
    const verify = jwt.verify(token, process.env.secretKey);
    const user = await Register.findById(verify._id);
    if (!user) {
      return resp.status(401).send("User not found  you have to login or register.");
    }
    const { name, service, namehome, forValue, highlight, location, current_status, contact, latitude, longitude, numroom, landmark } = req.body;
    if (name) user.name = name;
    if (service) user.service = service;
    if (namehome) user.namehome = namehome;
    if (forValue) user.for = forValue;
    if (highlight) user.highlight = highlight;
    if (location) user.location = location;
    if (contact) user.contact = contact;
    if (landmark) user.landmark = landmark;
    if (numroom) user.numroom = numroom;
    if (current_status) user.current_status = current_status;

    if (latitude && longitude) {
      user.latitude = latitude;
      user.longitude = longitude;
    }
    // Handle uploading the image
    if (req.files && req.files.length > 0) {
      const imageUploadPromises = req.files.map((file) => {
        return new Promise((resolve, reject) => {
          cloudinary.uploader.upload(file.path, (err, result) => {
            if (err) {
              console.error(err);
              reject(err);
            } else {
              user.image.push({ url: result.secure_url });
              resolve();
            }
          });
        });
      });

      await Promise.all(imageUploadPromises);
      await user.save();
      resp.redirect('dashboard');
    } else {
      // No images were uploaded, so don't modify the user's image array
      await user.save();
      resp.redirect('dashboard');
    }
  } catch (error) {
    console.error(error);
    resp.status(401).send('Login timeout. Please login.');
  }
});


// logout--------------------------------->>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
routes.get('/logout', (req, resp) => {
  resp.clearCookie('jwt')
  resp.redirect('/')
})

// login---------------------------->>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
routes.get('/login', (req, resp) => {
  resp.render('login')
})

routes.get('/landing', (req, resp) => {
  resp.render('landing')
})

// home------------------------------------------>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
routes.get('/', async (req, resp) => {
  const searchValue = req.query.search;
  const token = req.cookies.jwt;
  let userName
  if (token) {
    try {
      const verify = jwt.verify(token, process.env.secretKey);
      const userName = await Register.findById(verify._id);
      const regex = new RegExp(searchValue, 'i');
      if (searchValue) {
        var details = await Register.find({ location: regex })
      } else {
        var details = await Register.find()
      }


      resp.render('index', { details, userName });
    } catch (error) {
      console.error(error);
      resp.status(500).send("Internal Server Error");
    }
  } else {
    try {
      const regex = new RegExp(searchValue, 'i');
      if (searchValue) {
        var details = await Register.find({ location: regex })
      } else {
        var details = await Register.find()
      }

      resp.render('index', { details, userName });
    } catch (error) {
      console.error(error);
      resp.status(500).send("Internal Server Error");
    }
  }
});



routes.get('/user-details', async (req, resp) => {
  const userId = req.query.userId;
  const userDetails = await Register.findOne({ _id: userId })
  resp.render('user-details', { userDetails });

});


routes.get('/register', (req, resp) => {
  resp.render('register')
})

routes.post('/register', async (req, resp) => {
  try {
    const password = req.body.pass
    const confirmpassword = req.body.repass
    const email = req.body.email
    const checkemail = await Register.findOne({ email })
    
    if (checkemail) {
      resp.status(405).json({ success: false, message: 'Email is already registered' })
    } else {
      console.log(4);
      if (password == confirmpassword) {
        const userdata = new Register({
          name: req.body.name,
          email: req.body.email,
          contact: req.body.contact,
          password: req.body.pass,
          confirmpassword: req.body.repass,
        })
        const token = await userdata.generateAuthToken()
        resp.cookie("jwt", token, {
          expires: new Date(Date.now() + 5259600000),
          httpOnly: true,
          sameSite: 'Strict'
        });
        const registered = await userdata.save()
        resp.status(200).json({ success: true, message: 'register successful' });
      } else {
        resp.status(402).json({ success: false, message: 'Password do not match' });
      }
    }
  } catch (error) {
    resp.status(401).json({ success: false, message: 'Please try again later' });
  }
})

// login post..................................................
routes.post('/login', async (req, resp) => {
  const email = await req.body.email
  const password = await req.body.pass
  try {
    const useremail = await Register.findOne({ email: email })
    const ismatch = await bcrypt.compare(password, useremail.password)
    const token = await useremail.generateAuthToken()
    if (ismatch) {
      resp.cookie("jwt", token, {
        expires: new Date(Date.now() + 5259600000),
        httpOnly: true,
        sameSite: 'Strict'
      });
      resp.status(200).json({ success: true, message: 'Login successful' });
    } else {
      resp.status(401).json({ success: false, message: 'Your Email or Password is incorrect' });
    }
  } catch (error) {
    resp.status(401).json({ success: false, message: 'Your Email or Password is incorrect' });
  }

})

routes.post('/forgot-pass', async (req, resp) => {
  const email = await req.body.email;
  const findinguser = await Register.findOne({ email })
  if (!findinguser) {
    resp.status(401).json({ success: false, message: 'email not registerd... register first' });
    return;
  }
  const token = await findinguser.generateAuthToken()
  // linkgenerating
  const link = `https://roomoza.onrender.com/reset-pass/${findinguser._id}/${token}`
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.semail,
      pass: process.env.epass
    },
  });
  let mailGenerater = new Mailgen({
    theme: "default",
    product: {
      name: "Roomoza",
      link: 'https://roomoza.onrender.com/'
    }
  })
  let response = {
    body: {
      name: findinguser.name,
      intro: "reset your password",
      table: {
        data: [
          { 
            // item: `click the link to reset your password ${link}` 
            item: ` <p>This is your reset password link: <a href="${link}">Click Me</a></p>
            </body>` 
            
        }
        ]
      }
    },
    outro: "Looking forward to do more buissness"
  }
  let mail = mailGenerater.generate(response)
  // send mail with defined transport object
  const info = await transporter.sendMail({
    from: 'rawtemithlesh52@gmail.com', // sender address
    to: findinguser.email, // list of receivers
    subject: "reset password link✔", // Subject line
    text: `this is your reset password link ${link}`, // plain text body
    html: mail, // html body
  }).then(() => {
    return resp.status(200).json({ success: true, message: 'reset password send to your email' });

  }).catch(error => {
    return resp.status(401).json({ success: fale, message: 'failed to send email' });
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
  let { password, password2, _id, token } = req.body;
  try {
    const verify = jwt.verify(token, process.env.secretKey);
    password = await bcrypt.hash(password, 12);
    password2 = await bcrypt.hash(password2, 12);
    const updateResult = await Register.updateOne({ _id }, { $set: { password, confirmpassword: password2 } });
    if (updateResult.modifiedCount === 1) {
      resp.status(200).json({ status: true, message: "Password successfully updated" });
    } else {
      resp.status(404).json({ status: false, message: "Password updation failed" });
    }

  } catch (error) {
    console.log(error);
    resp.status(500).json({ status: false, message: "An error occurred while updating the password" });
  }
});

// send mssage
routes.post('/landing', async (req, resp) => {
  try {
    const { name, email, message } = req.body;
    const messagedetail = await sendmsg.create({
      name,
      email,
      message
    });
    resp.status(200).json({ success: true, message: "Message sent successfully" });
  } catch (error) {
    console.error(error);
    resp.status(500).json({ success: false, message: "An error occurred while sending the message" });
  }
});


// 404 page--------------------------
routes.get('*', (req, res) => {
  res.status(404).render('404.ejs');
});

module.exports = routes