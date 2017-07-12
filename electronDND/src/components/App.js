import '../assets/css/app.css';
import '../assets/css/materialize.min.css';
import 'hammerjs';
import 'jquery';

import SerialPort from 'serialport';
import React, { Component } from 'react';
import InfoBar from './infobar';
import ToolBar from './toolbar';
import MessageTerminal from '../containers/message_terminal';

var isSameSet = function( arr1, arr2 ) {
  return  $( arr1 ).not( arr2 ).length === 0 && $( arr2 ).not( arr1 ).length === 0;
}

var port;
var Readline = SerialPort.parsers.Readline;
var parser;

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      status: 0,
      ready: false,
      portList: [],
      userList: [
        [0, 'Zero'],
        [1, 'One'],
        [2, 'Two'],
        [3, 'Three'],
        [4, 'Four'],
        [5, 'Five'],
        [6, 'Six'],
        [7, 'Seven'],
        [8, 'Eight'],
        [9, 'Nine'],
        [100, 'All'],
      ]
    };

    this.sendMessage = this.sendMessage.bind(this);
    this.performConnection = this.performConnection.bind(this);
  }

  componentDidMount() {
    //Checks Changes in Port
    setInterval(function() {
      SerialPort.list(function (err, ports) {
        var portList = [];
        ports.forEach(function(port) {
          portList.push(port.comName);
        });
        if (!isSameSet( portList, this.state.portList)) {
          this.setState({portList: portList})
        }
      }.bind(this));
    }.bind(this), 5000)
  }

  //Send Message to Arduino
  sendMessage(message) {
    var formMessage = "<" + message + ">"
    if (port && message && this.state.ready == true) {
      this.setState({ready: false});
      port.write(formMessage, function(err) {
        if (err) {
          return console.log('Error on write: ', err.message);
        }
        console.log('Message Written');
      });
    }
  }

  //Connect to Arduino Serial
  performConnection(portName) {
    this.setState({status: 2, ready: false});
    if(port) {
      port.close((error) => {
        console.log("Closing Any Old Connection");
      })
    }
    port = new SerialPort(portName, {baudRate: 9600} ,(err) => {
      if(err) {
        console.log(err);
      } else {
        console.log('Accessing Port....');
      }
    })
    parser = port.pipe(Readline({delimiter: '\r\n'}));
    parser.on('data', (data) => {
      if(data.includes('Initialisation Complete')) {
        this.setState({status: 1});
      }
      if(data.includes('WAIT: Awaiting Input')) {
        this.setState({ready: true});
      }
      console.log(data);
    });

    //BUG: Timeout function still activates even if we swap port, since doesn't know (Minor)
    setTimeout(function() {
      if (this.state.status != 1) {
        this.setState({status: 3});
      }
    }.bind(this), 30000);
  }

  render() {
    return (
      <div>
        <InfoBar status={this.state.status}/>
        <div className='row'>
          <div className="col s8">
            <ToolBar
              performConnection={this.performConnection}
              portList={this.state.portList}
              sendMessage={this.sendMessage}
            />
            <MessageTerminal ready={this.state.ready} userList={this.state.userList}/>
          </div>
          <div className="col s4 secondPanel">6-columns (one-half)</div>

        </div>
      </div>
    );
  }
}


export default App;
