import React, { Component } from 'react';
import '../assets/css/toolbar.css';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { updateBurger } from '../actions/index';


class ToolBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      portName: 'Select a Port',
    };
    this.renderPorts = this.renderPorts.bind(this);
  }

  setPort(portName) {
    this.setState({portName: portName});
    this.props.performConnection(portName);
  }

  renderPorts() {
    if (this.props.portList.length == 0) {
      return(
        <li><a href="#!">Scanning for Ports...</a></li>
      );
    }

    return this.props.portList.map((port) => {
      return (
        <li onClick={() => this.setPort(port)} key={port}><a href="#!">{port}</a></li>
      );
    });
  }

  render() {
    return(
      <div className='row toolBar'>
        <a className='col s9 dropdown-button dropDownBar' href='#' data-activates='dropdown1'>
          <div className='row'>
            <label className='col s10 dropDownFont truncate noselect'>{this.state.portName}</label>
            <div className='col s2 dropDownIcon noselect right-align'>
              <i className='material-icons'>arrow_drop_down</i>
            </div>
          </div>
        </a>

        <ul id='dropdown1' className='dropdown-content'>
          {this.renderPorts()}
        </ul>



        <div className='col s2 center-align'>
          <div className='btn waves-effect waves-light settingBtn' onClick={this.props.show.bind(this)}>
            <i className="material-icons noselect">settings</i>
          </div>
        </div>
        <div className='col s1'>
          <div className='btn waves-effect waves-light pullBtn' onClick={() => this.props.updateBurger(true)}>
            <i className="material-icons noselect">reorder</i>
          </div>
        </div>
      </div>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ updateBurger }, dispatch);
}

export default connect(null, mapDispatchToProps)(ToolBar);
