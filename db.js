const mysql = require("mysql")
var pool = mysql.createPool({
    connectionLimit: "10",
    user: "root",
    password: process.env.password,
    database: "chatapp",
    host: "localhost",
    port: "3306",
    charset:'utf8mb4'
});
let db = {}
db.all = (user) => {
    return new Promise((resolve, reject) => {
        pool.query(`
        select u2.name as sender, u.name as reciever,i.lastmessage as last,i.time as time,i.date as date from inbox i inner join user u on u.id=i.reciever_id inner join user u2
        on u2.id=i.sender_id where ( i.reciever_id=?) OR ( i.sender_id=?) order by i.date,i.time desc`,[user,user], (err, result) => {
            if (err) { return reject(err) }
            return resolve(result)
       
        })
    })
}
db.findone = (user) => {
    return new Promise((resolve, reject) => {
       // console.log("im here")
        return pool.query("select * from user where name=?", [user], (err, result) => {
           // console.log(result[0])
            if (err) { return reject(err) }
            return resolve(result[0])

        })
    })
}
db.setmessage = (message,user, reciever, date,time) => {
   console.log("im in set messages")
    pool.query("insert into chats (sender_id,reciever_id,message,date,time)value(?,?,?,?,?)", [user, reciever, message, date,time], (err, result) => {
        if (err) {  console.log(err) }
        if(result){db.check(user,reciever,message,date,time)}
        

    })
}
db.changelastmessage=(sender,reciever,last,date,time)=>{
    pool.query("update inbox set reciever_id=?,sender_id=?,lastmessage=?,date=?,time=? where (reciever_id=? and sender_id=?) or(reciever_id=? and sender_id=?) ", [reciever,sender,last,date,time,sender, reciever,reciever,sender], (err, result) => {
        if (err) {  console.log(err) }
         console.log(result)
        
    })
}
    db.insertlastmessage=(sender,reciever,last,date,time)=>{
        pool.query("insert into inbox (reciever_id,sender_id,lastmessage,time,date) values(?,?,?,?,?)", [reciever,sender,last,time,date], (err, result) => {
            if (err) {  console.log(err) }
            
             console.log(result)
            
        })
    }


db.check=(sender,reciever,last,date,time)=>{
    pool.query("select id from inbox where (reciever_id=? and sender_id=?) or(reciever_id=? and sender_id=?) ", [sender, reciever,reciever,sender], (err, result) => {
        if (err) {  console.log(err) }
        console.log("checkhererere",result)
        if(result[0]!=undefined || result[0]!=null ){
               db.changelastmessage(sender,reciever,last,date,time)
        }else{
            db.insertlastmessage(sender,reciever,last,date,time)
        }


    })

}

db.setuser = (user,file) => {
  //  console.log("im here")
    pool.query("insert into user(name,email,address,gender,pincode,country,description,password,profilepic)values(?,?,?,?,?,?,?,?,?)", [user.username,user.email,user.address,user.msex[0],user.zip,user.country,user.desc, user.username,file.path], (err, result) => {
        console.log(err)
        if (err) { return (err) }
        console.log(result) 
        return (result)

    })
}
db.senddata = (user) => {
    return new Promise((resolve, reject) => {
        console.log("im in senddata")
        return pool.query("select (id,name,profilepic) from chat where name !=? sort by name", [user], (err, result) => {
            console.log(result[0])
            if (err) { return reject(err) }

            return resolve(result)

        })
    })
}

db.getmessages = (user, reciever) => {
    return new Promise((resolve, reject) => {
        console.log("im getmessages")
        return pool.query("select u2.name as sender, u.name as reciever,c.message,c.time,c.date from chats c inner join user u on u.id=c.reciever_id inner join user u2 on u2.id=c.sender_id where ( c.reciever_id=? AND c.sender_id=? ) OR ( c.reciever_id=? AND c.sender_id=? ) order by c.id asc", [user, reciever, reciever, user], (err, result) => {
            // console.log(result[0])
            if (err) { return reject(err) }

            return resolve(result)

        })
    })
}

db.findbyid = (id) => {
    return new Promise((resolve, reject) => {
        pool.query(`select * from user where id=?`, [id], (err, result) => {
            if (err) {
                console.log(err)
                return reject(err)
            }
            result[0].password = "not allowed";
            return resolve(result[0])

        })
    })

}


db.alldata=(userid)=>{
    return new Promise((resolve, reject) => {
        pool.query(`select * from user where id=? `, [userid], (err, result) => {
            if (err) {
                console.log(err)
                return reject(err)
            }
            result[0].password = "not allowed";
            return resolve(result[0])

        })
    })
}

    module.exports = db