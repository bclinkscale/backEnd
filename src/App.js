import React from 'react';
//import logo from './logo.svg';
import './App.css';
import DroneState from './droneController/DroneState'
import Commands from './droneController/Commands';
//import BCImin from './droneController/bci.min'

 
import { brotliCompress } from 'zlib';
//import { BCIDevice } from '../public/js/BCIDevice';

function App() {
  return (
    <div>
      <DroneState/>
      <Commands/>
      </div>
  );
}

export default App;
