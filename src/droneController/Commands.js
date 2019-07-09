import React from 'react'
import socket from '../socket';
import {BCIDevice} from './BCIDevice'
/*eslint-env jquery*/

let buffer = new Array();
const SECONDS = 0.25;
const BUFFER_SIZE = SECONDS * 256;
const WEIGHT = 0.95;
let weighted = {
    alpha: -1,
    beta: -1,
    theta: -1,
    gamma: -1,
    engagement: -1
}
// let data = []
// data.fill(1,0,20)

// $( document ).ready(function() {
// let nodeConnect = socket(500)
// 			nodeConnect.sendEngagement(weighted.engagement);
// })


let bci = new BCIDevice({
    dataHandler: data => {
        data.data.forEach(el => {
            if (buffer.length > BUFFER_SIZE) buffer.shift();
            buffer.push(el);
        });
        if (buffer.length < BUFFER_SIZE) return;
        let psd = window.bci.signal.getPSD(BUFFER_SIZE, buffer);

			let alpha = window.bci.signal.getBandPower(BUFFER_SIZE, psd, 256, "alpha");
			let beta  = window.bci.signal.getBandPower(BUFFER_SIZE,psd, 256, "beta");
			let theta = window.bci.signal.getBandPower(BUFFER_SIZE,psd, 256, "theta");
			let gamma = window.bci.signal.getBandPower(BUFFER_SIZE,psd, 256, "gamma");
			let engagement = beta / (alpha + theta);
			let sum = alpha + beta + theta + gamma;

			let w_alpha = alpha / sum;
			let w_beta = beta / sum;
			let w_theta = theta / sum;
            let w_gamma = gamma / sum;

            if (weighted.alpha < 0) {
				weighted.alpha = w_alpha || 0;
				weighted.beta = w_beta || 0;
				weighted.theta = w_theta || 0;
				weighted.gamma = w_gamma || 0;
				weighted.engagement = engagement || 0;
			} else {
				weighted.alpha = weighted.alpha * WEIGHT + (w_alpha || 0) * (1 - WEIGHT);
				weighted.beta =  weighted.beta  * WEIGHT + (w_beta  || 0)  * (1 - WEIGHT);
				weighted.theta = weighted.theta * WEIGHT + (w_theta || 0) * (1 - WEIGHT);
				weighted.gamma = weighted.gamma * WEIGHT + (w_gamma || 0) * (1 - WEIGHT);
				weighted.engagement = weighted.engagement * WEIGHT + (engagement || 0) * (1 - WEIGHT);
			}
            
            let plotTarget;
            let totalPoints = 80;

            plotTarget = weighted.gamma;
			if (data.length < totalPoints) {
				data.push(plotTarget);
			} else {
				data = data.data.slice(1)
				data.push(plotTarget);
            }
            

            

            /*
			res = [];
			for (var i = 0; i < data.length; ++i) {
				res.push([i, data[i]]);
			}

			if (plotTarget  > thresh){
				chart_options.colors = ["#6ef146"];
			} else {
				chart_options.colors = ["#F5D552"];
			}
			$.plot("#chart", [ drawRawData(res) ], chart_options);
        */
    }, 

    statusHandler: status => {

    }, 

    connectionHandler: connected => {

    }

})

let connect_function = async () => {
    try {
      await bci.connect();
      console.log("connected!")
      // Here, the device is for sure connected
    } catch (e) {
      console.log(e)
      // Here, the user cancelled or the device failed to connect.
    }
  }

function sendCommand(command) {
    return function() {
    console.log('Sending Command');
    socket.emit('command', command)
}}


const Commands = () => (
    <div>
        <button onClick={sendCommand('takeoff')}>Take Off</button>
        <button onClick={sendCommand('up 35')}>Up 35cm</button>
        <button onClick={sendCommand('left 20')}>Left 20cm</button>
        <button onClick={sendCommand('right 20')}>Right 20cm</button>
        <button onClick={sendCommand('down 35')}>Down 35cm</button>
        <button onClick={sendCommand('forward 35')}>forward 35cm</button>
        <button onClick={sendCommand('back 20')}>Back 20cm</button>
        <button onClick={sendCommand('flip r')}>flip right</button>
        <button onClick={sendCommand('flip f')}>flip forward</button>
        <button onClick={sendCommand('flip b')}>flip back</button>
        <button onClick={sendCommand('flip l')}>flip left</button>
        <button onClick={sendCommand('land')}>Land</button>
        <button onClick={sendCommand('emergency')}>Emergency</button>
        <button onClick={connect_function}>Connect BCI</button>
    </div>
)
export default Commands;