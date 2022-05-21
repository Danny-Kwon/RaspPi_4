const mcpadc = require('mcp-spi-adc');
const { clearInterval } = require('timers');
const VRZ = 3;
const SPI_SPEED = 1000000;
const lightSensor = {
    light: 0,
    webio: 0,
    timerId: 0,
    init: (io) => {
        lightSensor.light = mcpadc.openMcp3208(VRZ,
        {speedHz: SPI_SPEED},
        (err) => {
            console.log("SPI 채널 3 초기화완료!");
            console.log("-------------------------");
            if(err){console.log('채널 3 초기화실패!(HW점검)'); process.exit();}
        });
        lightSensor.webio = io;
    },
    read: () => {
        let value = -1;
        lightSensor.light.read((error, reading)=> {
            value = reading.rawValue;
            console.log("조도: %d", value)
            if (value != -1){
                lightSensor.webio.sockets.emit('watch', value);
                value = -1;
            }
        });
    },
    start: (timerValue) => {
        if(lightSensor.timerId != 0)
            clearInterval(lightSensor.timerId);
            lightSensor.timerId = 0;
    },
    terminate: () => {
        lightSensor.light.close( ( ) => {
            console.log('MCP-ADC를 해제하고, 웹서버를 종료합니다');
            process.exit();
        });
    }
}

module.exports.init = function(io){ lightSensor.init(io); };
module.exports.read = function() { lightSensor.read() ; };
module.exports.start = function(timerValue) { lightSensor.start(timerValue); };
module.exports.stop = function( ) { lightSensor.stop( ); };
module.exports.terminate = function( ) { lightSensor.terminate( ); };