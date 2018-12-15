var WebSocketServer = require('ws').Server;
var wss = new WebSocketServer({port:8081});

var clients = {}

// 只要有用户连接到我们的服务器,就执行这个函数
wss.on('connection', (ws)=>{
	// ws指连接到我这台服务器的那个用户
	var ip = ws._socket.remoteAddress.replace('::ffff:','');
	
	// 每一个用户连接到服务器后，ws仅仅表示自己，所以需要有一个对象，记录所有连接到服务器的客户端	
	clients[ip] = ws;
	//广播
	function notify(payload){
		for (var i in clients) {
			var c=clients[i];
			//发送的前提是，客户端与服务器是连接的
			if (c.readyState==1) {
				c.send( JSON.stringify(payload));
			}
		}
	}
	
	notify({ type:"loginsuccess",ip:ip});
	console.log(ip+"连接到服务器了");
	
	//服务器得到客服端发过来的数据时
	ws.on('message',function(message){
		message=message.replace(/[<>]/g,'');
		var obj=JSON.parse( message);
		switch(obj.type){
			case "say":
			obj.ip=ip;
			notify(obj);
			break;
			
		}
		console.log(obj);
	})
	
	
	
})