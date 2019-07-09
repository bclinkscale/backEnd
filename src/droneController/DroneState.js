import React from 'react'
import { useState, useEffect } from 'react';
//import { useState } from 'react';
import socket from '../socket';

function useDroneState() {
    const [droneState, updateDroneState] = useState({});
    useEffect(() => {
      socket.on('dronestate', updateDroneState);
      return () => socket.removeListener('dronestate');
    }, []);
    return droneState;
  } 
function useSocket(){
    const [status,updateStatus] = useState('DISCONNECTED');

    socket.on('status', message => {
        console.log('MESSAGE FROM SOCKET');
        updateStatus(message);
    }, []);
    return status;
}
const DroneState = () => {
    const status = useSocket();
    const droneState = useDroneState([])
    return (
    <div>
    <p>Status: {status}</p>
    {/* <p>Drone State: {droneState}</p> */}
    </div>
    );
};
export default DroneState; 