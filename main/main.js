var socket = io("http://localhost:8081")
socket.on("connect", () => {
    console.log(`you are connected to: ${socket.id}`)
})

const parseCookie = str =>
str
.split(';')
.map(v => v.split('='))
.reduce((acc, v) => {
    acc[decodeURIComponent(v[0].trim())] = decodeURIComponent(v[1].trim());
    return acc;
}, {});
var name2 = parseCookie(document.cookie)
document.getElementById("pp").setAttribute("src",`/profile/${name2.name}`)


var profile
var inbox
var elementinbox=async(user)=>{
    //document
   
    if(name2.name!=user.sender){
    var element=`<div class="chat" onclick="chatopener(event)" name="${user.sender}">
    <div class="contact-profile-picture" name="${user.sender}">
        <img src="/profile/${user.sender}" name="${user.sender}">
    </div>
    <div class="chat-right" name="${user.sender}">
        <div class="chat-right-top" name="${user.sender}">
            <div class="contact-id" name="${user.sender}">
                <h2 name="${user.sender}">${user.sender}</h2>
            </div>
            <div class="last-message-time" name="${user.sender}">
                <h4 name="${user.sender}">${user.time}</h4>
            </div>
        </div>
        <div class="last-message" name="${user.sender}">
            <h4 name="${user.sender}">${user.last}</h4>
        </div>
    </div>
</div>`;
    var d = document.createElement("div");
    d.innerHTML=element
    document.getElementById("chat_box").appendChild(d)
}

    else{
        var element=`<div class="chat" onclick="chatopener(event)" name="${user.reciever}">
    <div class="contact-profile-picture" name="${user.reciever}">
        <img src="/profile/${user.reciever}">
    </div>
    <div class="chat-right" name="${user.reciever}">
        <div class="chat-right-top" name="${user.reciever}">
            <div class="contact-id" name="${user.reciever}">
                <h2 name="${user.reciever}">${user.reciever}</h2>
            </div>
            <div class="last-message-time" name="${user.reciever}">
                <h4 name="${user.reciever}">${user.time}</h4>
            </div>
        </div>
        <div class="last-message" name="${user.reciever}">
            <h4 name="${user.reciever}">${user.last}</h4>
        </div>
    </div>
</div>`;
    var d = document.createElement("div");
    d.innerHTML=element
    document.getElementById("chat_box").appendChild(d)
    }
   
}
var onload=async()=>{
    await axios.get("/alldata").then(res=>{inbox=res.data}).catch(e=>{console.log(e)})
    //document.getElementById("chat_box").innerHTML=null;
    inbox.forEach(element => {
        
        elementinbox(element);
    });


};
//setInterval(onload,6000)

function chatopener(event){
 var evname=event.target.attributes["name"].value
 document.getElementById("iframe").setAttribute("src",`/lol/${evname}`)
}

socket.on(String(name2.name)+"alert", (message,sendername,date,time) => {

alert(`${sendername}:${message}`)


})
 var seen=async()=>{}

