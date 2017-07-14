import React from 'react';
import '../assets/css/infobar.css';

const arduinoStatus = (status) => {
  if (status == 1) {
    return(<label className='labelColor'>ARDUINO: <span className='lblgreen'>ONLINE</span></label>);
  } else if (status == 0) {
    return(<label className='labelColor'>ARDUINO: <span className='lblred'>OFFLINE</span></label>);
  } else if (status == 2) {
    return(<label className='labelColor'>ARDUINO: <span className='lblred'>CONNECTING...</span></label>);
  } else if (status == 3) {
    return(<label className='labelColor'>ARDUINO: <span className='lblred'>NO DEVICE FOUND</span></label>);
  }
}

const closeWindow = () => {
  const remote = require('electron').remote;
  let w = remote.getCurrentWindow();
  w.close();
}

const minimise = () => {
  const remote = require('electron').remote;
  let w = remote.getCurrentWindow();
  w.minimize();
}

const InfoBar = (props) => {
  return(
    <div className='barColor noselect' >
      {/* <div className='circleExit' onClick={closeWindow.bind(this)}/>
      <div className='circleMinimise' onClick={minimise.bind(this)}/> */}
      {arduinoStatus(props.status)}
    </div>
  );
}

export default InfoBar;
