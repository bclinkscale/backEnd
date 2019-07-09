const electron = require ('electron')
const dgram = require('dgram'); 
const delayy = require('delay')
const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http)

const commandDelays = require('./commandDelay')
const PORT = 8889;
const HOST = '192.168.10.1';

const drone = dgram.createSocket('udp4');
drone.bind(PORT);

drone.on('message', message => {
    //console.log(` Command: ${message}`);
    //moveDrone()
});




function handleError(err){
    if (err){
        //console.log('ERROR');
        //console.log(err);
    }
}

drone.send('command', 0, 8, PORT, HOST, handleError);
drone.send('battery?', 0, 8, PORT, HOST, handleError);

const commands = ['command', 'battery?', 'takeoff', 'forward', 'land'];
let i = 0;

// async function go(){
//     const command = commands[i];
//     const delay = commandDelays[command];
//     console.log(`running command: ${command}`);
//     drone.send(command,  0, command.length, PORT, HOST, handleError);
//     await delayy(delay);
//     i+=1;
//     if (i<commands.length){
//         return go()
//     } 
//     console.log('done!');
// }
// go(); 


let eng = -1;

io.on('connection', socket => {
    socket.on('command', command => {
        console.log('Command Sent from browser');
        console.log(command);
        drone.send(command, 0, command.length, PORT, HOST, handleError);
    } );  
    socket.on('data', data => {
        
         eng = data
    }) 
    
     socket.emit('status', 'CONNECTED')
 })
http.listen(6767, () => {
    console.log('Socket io server up and running')
}); 
let temp; 



let droneState = 0
let droneMaxCommand = 5
let maxDistance = 100
let direction = -1
let frequency = 500
let amplitude = 20

function createCommand(direction, distance) {
    return direction + " " + distance
}

function command(direction, distance) {
    let cmd = createCommand(direction, distance)
    drone.send(cmd, 0, cmd.length, PORT, HOST, handleError);
}

function decider() {
    let tempState = droneState % droneMaxCommand
    direction = tempState == 0 ? direction * -1 : direction
    let dynamicAmplitude = Math.round(eng * maxDistance)
    command("up", dynamicAmplitude)
    console.log(eng, dynamicAmplitude)

    

    /*
    if (direction > 0 ) {
        command("up", amplitude)
    } else {
        command("down", amplitude)
    }*/

    droneState++;
}



function moveDrone(){
    let threshold = 0.2;
    let takeoff = false; 
    let distance = 50;
    drone.send('takeoff', 0, 8, PORT, HOST, handleError);
    setInterval(decider, frequency)


    //let temp; 
/*
    if (eng > threshold){
        if(takeoff == false){
            takeoff = true;
            drone.send('takeoff', 0, 8, PORT, HOST, handleError);
        }
        console.log('Engagement is: ')
        console.log(eng)
        if(eng > 0.2 && takeoff != false){
            
            if(temp < eng){
                drone.send('up 30', 0, 'up 30'.length, PORT, HOST, handleError);
            }
            else{
                drone.send('down 30', 0, 'down 30'.length, PORT, HOST, handleError)
            }
        }
        
        setTimeout(moveDrone,6000)
    }else{
        console.log('Engagement isnt above .2')
        setTimeout(moveDrone,3000)
    }

    temp = eng;

*/
}

moveDrone()
//setInterval(moveDrone, 3000)



// if (data > threshold){
//     if(takeoff === false){
//         takeoff = true 
//         console.log('Taking off'); 
//         drone.send('takeoff', 0, 6, PORT, HOST, handleError);
//         setTimeout(moveDrone, 5000)
//     }
// }

// }
