const gpio = require('pigpio').Gpio;
const TRIG = 6;
const ECHO = 13;
const trig = new gpio(TRIG, {mode: gpio.OUTPUT});
const echo = new gpio(ECHO, {mode: gpio.INPUT, alert: true});

const sonic = {
    timerId : 0,
    init: (io) => {
        let startTick, distance, diff, dist;
        console.log('초음파센서을 초기화합니다');
        trig.digitalWrite(0);
        echo.on('alert', (level, tick) => {
            if (level == 1) { startTick = tick; }
            else{
                const endTick = tick;
                diff = endTick - startTick;
                distance = diff / 58; 
                dist = Number(distance.toFixed(1));
                console.log("근접거리:" + dist);
                io.sockets.emit('watch', dist);
            }
        });
    },
    start: (timerValue) => {
        if (sonic.timerId == 0) {
            sonic.timerId = setInterval( ( ) => { trig.trigger(10, 1); }, timerValue);
        }
        else {
            console.log("이미 가동중입니다.....");
        }
    },
    stop: ( ) => {
        if (sonic.timerId != 0) {
            clearInterval(sonic.timerId);
            sonic.timerId = 0;
        }
    }
};
module.exports.init = function(io) { sonic.init(io); };
module.exports.start = function(timerValue) { sonic.start(timerValue); };
module.exports.stop = function( ) { sonic.stop( ); };