const http = require('http');
const fs = require('fs');
const network = require('network');
const sonic = require('./sensors/sonic.js');
const PORT = 65001;
const webServer = (request, response ) => {
    fs.readFile('views/webpage.html', 'utf8', function (error, data) {
        response.writeHead(200, { 'Content-Type': 'text/html' }); response.end(data);
        console.log("웹페이지에 접속하였습니다");
     });
}

const server = http.createServer(webServer);
server.listen(PORT, ( ) => {
    network.get_active_interface( (err, ifaces) => {
        if (ifaces !== undefined) {
            if (ifaces.name == 'wlan0') {
                console.log("===================================================");
                console.log('웹서버가 대기중입니다 http://' + ifaces.ip_address + ':' + PORT);
                console.log("웹브라우져를 열고, 라즈베리파이 웹주소로 접속하세요");
                console.log("===================================================");
        } } });
});

const io = require('socket.io')(server);
sonic.init(io);
io.on('connection', client => {
    client.on('startmsg', (data) => {
        console.log('가동메시지 수신(측정주기:%d)! ', data);
        timeout = data;
        sonic.start(data);
    });
    client.on('stopmsg', (data) => {
        console.log('중지메시지 수신!');
        sonic.stop( );
    });
});
process.on('SIGINT', ( ) => {
    console.log("프로그램을 종료합니다");
    process.exit();
});