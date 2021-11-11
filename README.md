# chatwebsite

you need node js intalled in you device.

to run just npm install in vs code.

u need to connect my sql server.

i made chatapp database in which i had three tables 

user -> (id,name,email,address,gender,pincode,country,description,password,profilepic)

chats->(id ,sender_id,reciever_id,message,date ,time , file)

indox->(id ,sender_id,reciever_id,lastmessage,date ,time)

after creating database connect it to db.js file

make a .env file add 

password=xxxxx   (replace x with you sql password)

to start just type npm start.
