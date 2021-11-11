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
document.getElementById("pp").setAttribute("src",`/profile/${name2.Rname}`)
document.getElementById("recname").innerText=name2.Rname
var option={method:"get",url:`/messages/${name2.Rname}`}
var alldata=async(option)=>{await axios(option).then(res=>{
    var data=res.data
    for(var i=0;i<data.length;i++){
        console.log("in for loop")
         if(data[i].sender==name2.Rname){
            var elementl = `<div class="chat-l">
            <div class="mess">
                <p>${data[i].message}</p>
                <div class="check">
                    <span>${data[i].time}</span>
                </div>
            </div>
            <div class="sp"></div>
        </div>`
        var d = document.createElement("div");
d.innerHTML=elementl
document.getElementById("chat-box").appendChild(d)

         }
         else{
            var element2 = `<div class="chat-r">
            <div class="sp"></div>
            <div class="mess mess-r">
                <p>
                ${data[i].message}
                </p>
                <div class="check">
                    <span>${data[i].time}</span>
                </div>
            </div>
            </div>`
            var d = document.createElement("div");

d.innerHTML=element2
document.getElementById("chat-box").appendChild(d)
         }

    }
}).catch(e=>console.log(e))}

alldata(option)






//console.log(name2)
var but = document.getElementById('sendmess')
console.log(but)
but.addEventListener("click", sendmessage);

function sendmessage() {
    var name = name2.Rname;
    var message = document.getElementById("message");
    message = message.value;
    socket.emit("message", message, String(name),name2.name)
    var time=new Date().toLocaleTimeString();
    var element2 = `<div class="chat-r">
<div class="sp"></div>
<div class="mess mess-r">
    <p>
     ${message}
    </p>
    <div class="check">
        <span>${time}</span>
    </div>
</div>
</div>`
var d = document.createElement("div");

//var text = document.createTextNode(`${sendername}:${message}-${date} : ${time}`);
d.innerHTML=element2
document.getElementById("chat-box").appendChild(d)
}

socket.on(String(name2.name), (message,sendername,date,time) => {

 if(name2.Rname==sendername){
var elementl = `<div class="chat-l">
					<div class="mess">
					    <p>${message}</p>
						<div class="check">
							<span>${time}</span>
						</div>
					</div>
					<div class="sp"></div>
				</div>`
    var d = document.createElement("div");
//var text = document.createTextNode(`${sendername}:${message}-${date} : ${time}`);
d.innerHTML=elementl
document.getElementById("chat-box").appendChild(d)
 }
 
})