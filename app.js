require("dotenv").config()
const exp = require("express")
const path = require("path")
const ses = require('express-session')
const passport = require("passport")
const LocalStrategy = require('passport-local').Strategy;
const db = require("./db.js")
const bodyParser = require("body-parser")
const { json } = require("body-parser")
const { session, authenticate } = require("passport")
const app = exp()
const multer = require("multer")
const { setmessage } = require("./db.js")
const filestore = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./imag")
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "--" + file.originalname)
  }


})
const upload = multer({ storage: filestore })
const io = require("socket.io")(8081,
  {
    cors: {
      origin: ["http://localhost:8080/lol", "http://localhost:8080", "http://124.253.130.177:8081/lol", "http://124.253.130.177:8081"],

    }
  })
io.on("connection",socket => {
  console.log(socket.id)
  socket.on("message",async(message, name, sendername,image) => {
    var date=String(new Date().toLocaleDateString())
    date=date.split("/")
    date=`${date[2]}-${date[1]}-${date[0]}`
    var d=String(new Date().toLocaleTimeString())
    var d=new Date(date+" "+d)
    console.log(d)
    var time=`${d.getHours()}:${d.getMinutes()}`;
    
    var reciever
    await db.findone(name).then(res=>{reciever=res.id})
    var sender
    await db.findone(sendername).then(res=>{sender=res.id})
    console.log(message, name,date,time)
    if(sender!=reciever){
    await db.setmessage(message, sender,reciever,date,time)
    io.emit(String(name), message, sendername,date,time)
    io.emit(String(name)+"alert", message, sendername,date,time)
    }
  })
})


app.use(exp.static("./public"))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded())
app.use(ses({
  secret: 'money monkey',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}))


passport.use(new LocalStrategy(
  function (username, password, done) {
    db.findone(username).then((res) => {
      var user = res
      // console.log("im herekjbcc", user)
      if (!user) { return done(null, false); }
      if (user.password != password) { return done(null, false); }
      else { if (username == user.name) { return done(null, user) }; }
    }).catch((err) => { console.log(err) })

  }));

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => {
  if (user) { return done(null, user.id) }
  return done(null, false)
});

passport.deserializeUser((id, done) => {
  db.findbyid(id).then((res) => {
    var user = res
    if (!user) { return done(null, false) }
    return done(null, user)
  }).catch((err) => console.log(err))

})

function isAuthenticated(req, res, done) {
  if (req.user) { return done() }
  return res.redirect("/")
}
app.get("/logout", isAuthenticated, (req, res) => {
  req.logout();
  res.send("logged out")
})

//for main page
// app.get("/nexus", isAuthenticated, (req, res) => {
//   // console.log("im in lol", req.session)
//   res.cookie("name", req.user.name)//can add more details
//   res.sendFile(path.join(__dirname, "/main/iframe.html"))
// })

app.get("/main", isAuthenticated, (req, res) => {
  // console.log("im in lol", req.session)
  res.cookie("name", req.user.name)//can add more details
  res.sendFile(path.join(__dirname, "/main/main4.html"))
})
app.get("/cl.css", isAuthenticated, (req, res) => {
  // console.log("im in lol", req.session)
  res.sendFile(path.join(__dirname, "/main/cl4.css"))
})
app.get("/istyle.css", isAuthenticated, (req, res) => {
  // console.log("im in lol", req.session)
  res.sendFile(path.join(__dirname, "/main/istyle.css"))
})
app.get("/main.js", isAuthenticated, (req, res) => {
  // console.log("im in lol", req.session)
  res.sendFile(path.join(__dirname, "/main/main.js"))
})

app.get("/lol/:Rname", isAuthenticated, (req, res) => {
  // console.log("im in lol", req.session)
  res.cookie("name", req.user.name)//can add more details
  res.cookie("Rname",req.params.Rname)
  res.sendFile(path.join(__dirname, "/client/index2.html"))
})
app.get("/client.js", isAuthenticated, (req, res) => {
  // console.log("im in lol", req.session)
  res.sendFile(path.join(__dirname, "/client/client.js"))
})
app.get("/style2", isAuthenticated, (req, res) => {
  // console.log("im in lol", req.session)
  res.sendFile(path.join(__dirname, "/client/style2.css"))
})
app.get("/messages/:Name", isAuthenticated, async(req, res) => {
  var reciever
  await db.findone(req.params.Name).then(res=>{reciever=res.id})
  db.getmessages(req.user.id,reciever).then((resp) => res.send(resp)).catch((e) => console.log(e))
})

app.post('/login', passport.authenticate('local'), (req, res) => {
  res.redirect("/main")
});
app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, "/public/index.html"))
});
app.get('/cometonexus', (req, res) => {
  res.sendFile(path.join(__dirname, "/public/welcome.html"))
});

app.get('/create', (req, res) => {
  res.sendFile(path.join(__dirname, "/public/sample.html"))
});

app.post('/create',upload.single('image'), (req, res) => {
  const obj = JSON.parse(JSON.stringify(req.body));
  console.log("in create")
  console.log(obj, req.file)
  console.log(req.file)
  db.setuser(obj, req.file)
  //  res.sendFile(path.resolve(req.file.path))
  res.redirect("/login")
});
app.get("/alldata",isAuthenticated,async(req, res) => {
  
  var p;
  await db.all(req.user.id).then((res)=>{console.log("lolololo",res,"funfun")
    p=res}).catch(e=>console.log(e))
    res.send(p)
  
  })

app.get("/profile/:name",isAuthenticated, async(req, res) => {
  //console.log(req.params.name)
  var p;
  await db.findone(req.params.name).then((res)=>{
    p=res}).catch(e=>console.log(e))
  res.sendFile(path.resolve(String(p.profilepic)))
})

app.listen('8080', () => { console.log("server is listening"); })
