import React, { Component } from 'react';
import '../assets/css/message_terminal.css';

class MessageTerminal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      message: '',
      checkedBox: []
    };

  }

  handleChange(event) {
    this.setState({message: event.target.value});
  }

  handleToggle(val) {
    if (val[0] == 100) {
      var index = this.state.checkedBox.indexOf(val[0])
      if (index != -1) {
        this.setState({checkedBox: [] })
      } else {
        this.setState({checkedBox: [val[0]] })
      }
      return;
    }

    var index = this.state.checkedBox.indexOf(val[0])
    if (index == -1) {
      this.setState({checkedBox: [ val[0], ...this.state.checkedBox] })
    } else {
      var breakArray = [ ...this.state.checkedBox];
      breakArray.splice(index, 1);
      this.setState({checkedBox: breakArray })
    }
  }

  messageCount() {
    if (this.state.message.length > 120) {
      return(
        <span className='shiftCountRED right'>LIMIT REACHED - {this.state.message.length}/120</span>
      );
    }
    return(
      <span className='shiftCount right'>{this.state.message.length}/120</span>
    );
  }

  readyStatus() {
    if(this.props.ready) {
      return(
        'Ready for Input'
      );
    } else {
      return('Arduino Not Ready');
    }
  }

  renderUsers() {
    return this.props.userList.map((user) => {
      var index = this.state.checkedBox.indexOf(user[0]);
      var indexAll = this.state.checkedBox.indexOf(100);
      if (indexAll != -1 && user[0] != 100) {
        return(
          <label className="col s2 userBoxDisabled waves-effect waves-light disabled" key={user[0]} onClick={this.handleToggle.bind(this, user)}>
            <span className="userBoxShift">{user[1]}</span>
          </label>
        );
      }

      if(index != -1) {
        return(
          <label className="col s2 userBoxActive waves-effect waves-light" key={user[0]} onClick={this.handleToggle.bind(this, user)}>
            <span className="userBoxShift">{user[1]}</span>
          </label>
        );
      }

      return (
        <label className="col s2 userBox waves-effect waves-light" key={user[0]} onClick={this.handleToggle.bind(this, user)}>
          <span className="userBoxShift">{user[1]}</span>
        </label>
      );
    });

  }

  readyMessage(val) {
    if(this.state.message === '') {
      return;
    }

    if(val) {
      //Send Message
      var modifiedMessage = '';
      this.state.checkedBox.forEach((data) => {
        if (data == 100) {
          modifiedMessage = modifiedMessage.concat('a,');
        } else {
          modifiedMessage = modifiedMessage.concat(data);
          modifiedMessage = modifiedMessage.concat(',');
        }
      })
      modifiedMessage = modifiedMessage.substring(0, modifiedMessage.length - 1);
      modifiedMessage = modifiedMessage.concat('-');
      modifiedMessage = modifiedMessage.concat(this.state.message);
      console.log(modifiedMessage);
    } else {
      //Queue Message
    }

  }

  render() {
    return(
      <div className="noselect row">
        <div className="input-field col s12">
          <textarea
            placeholder={`${this.readyStatus()}`}
            id="textarea1"
            className="materialize-textarea"
            value={this.state.message}
            onChange={(event) => this.handleChange(event)}
          ></textarea>
          <label>Serial Terminal:</label>
          {this.messageCount()}
        </div>

        <div className='col s12 center-align'>
          <div className='row userContainer'>
            {this.renderUsers()}
          </div>

        </div>

        <div className='col s12 right-align'>
          <div className="btn queueBtn" onClick={() => this.readyMessage(0)}>
            QUEUE
          </div>
          <div className="btn sendBtn" onClick={() => this.readyMessage(1)}>
            SEND
          </div>
        </div>
      </div>
    );
  }
}

export default MessageTerminal;
