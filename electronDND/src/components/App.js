import '../assets/css/app.css';
import '../assets/css/materialize.min.css';
import Styles from '../assets/css/rodal.css';

import SerialPort from 'serialport';
import React, { Component } from 'react';
import InfoBar from './infobar';
import ToolBar from '../containers/toolbar';
import MessageTerminal from '../containers/message_terminal';
import HistoryList from '../containers/history_list';
import Rodal from 'rodal';
import QueueList from '../containers/queue_list';

import ElectronJsonStorage from 'electron-json-storage';

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
      ready: 0,
      portList: [],
      userList: [
        [0, ''],
        [1, ''],
        [2, ''],
        [3, ''],
        [4, ''],
        [5, ''],
        [6, ''],
        [7, ''],
        [8, ''],
        [9, ''],
        [100, 'All'],
      ],
      visible: false,
    };

    this.sendMessage = this.sendMessage.bind(this);
    this.performConnection = this.performConnection.bind(this);
  }

  componentWillMount() {
    ElectronJsonStorage.has('setting', (error, hasKey) => {
      if (hasKey) {
        ElectronJsonStorage.get('setting', (error, data) => {
          this.setState({userList: data});
          console.log("Hi");
        });
      }
    })
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
    console.log("SENDING:" + message);

    var formMessage = "<" + message + ">"
    if (port && message && this.state.ready == 1) {
      port.write(formMessage);
    }
  }

  //Connect to Arduino Serial
  performConnection(portName) {
    this.setState({status: 2, ready: 0});
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
      if(data.includes('SENDING DATA')) {
        this.setState({ready: 2});
      }
      if(data.includes('WAIT: Awaiting Input')) {
        this.setState({ready: 1});
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

  show() {
    this.setState({ visible: true });
  }

  hide() {
    this.setState({ visible: false });
  }

  renderUser() {
    return this.state.userList.map((user) => {
      if(user[0] == 100) {
        return;
      }

      return (
        <div className="input-field col s6" key={`${user[0]}${user[1]}`}>
          <input placeholder="Player Name"
            ref={(input) => this['input' + user[0]] = input}
            type="text"
            defaultValue={user[1]}
          />
          <label className='noselect active'>{`LCD ${user[0]}`}</label>
        </div>
      )
    })
  }

  saveChanges(event) {
    event.preventDefault();
    var array = [
      [0, this.input0.value],
      [1, this.input1.value],
      [2, this.input2.value],
      [3, this.input3.value],
      [4, this.input4.value],
      [5, this.input5.value],
      [6, this.input6.value],
      [7, this.input7.value],
      [8, this.input8.value],
      [9, this.input9.value],
      [100, 'All'],
    ];
    this.setState({
      userList: array
    });

    ElectronJsonStorage.set('setting', array);
    this.hide();
  }

  render() {
    return (
      <div>

        {/* Main Body */}
        <InfoBar status={this.state.status}/>
        <div className='row'>
          <div className="col s12">
            <ToolBar
              performConnection={this.performConnection}
              portList={this.state.portList}
              sendMessage={this.sendMessage}
              show={this.show.bind(this)}
            />
            <MessageTerminal
              ready={this.state.ready}
              userList={this.state.userList}
              sendMessage={(msg) => this.sendMessage(msg)}
            />
            <HistoryList userList={this.state.userList} sendMessage={(msg) => this.sendMessage(msg)} ready={this.state.ready}/>
          </div>
          <QueueList userList={this.state.userList}/>
          {/* Pop up Message */}
        </div>
        <Rodal
          visible={this.state.visible}
          customStyles={Styles}
          onClose={this.hide.bind(this)}
          height={500}
        >
            <h6 className='noselect'>LCD Assignment</h6>
            <form className='row' onSubmit={this.saveChanges.bind(this)}>
              {this.renderUser()}
              <input className='btn right noselect' type="submit" value="Submit" />
            </form>
            <div className='btn right cancelBtn orange noselect' onClick={() => this.hide()}>Cancel</div>
            <label className='shiftLbl2 noselect'>*Leave Name Blank to hide LCD from option list</label>
        </Rodal>
      </div>
    );
  }
}


export default App;
