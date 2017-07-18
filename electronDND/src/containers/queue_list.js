import React, { Component } from 'react';
import { slide as Menu } from 'react-burger-menu'
import '../assets/css/queue_list.css';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import ElectronJsonStorage from 'electron-json-storage';

import { updateBurger, saveToQueue, removeFromQueue, preloadQueue } from '../actions/index';
import QueueDetail from '../components/queue_detail';

class QueueList extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    ElectronJsonStorage.has('queue', (error, hasKey) => {
      if (hasKey) {
        ElectronJsonStorage.get('queue', (error, data) => {
          this.props.preloadQueue(data);
        });
      }
    })
  }

  showSettings (event) {
    event.preventDefault();
  }

  updateState(state) {
    this.props.updateBurger(state.isOpen);
  }

  renderQueue() {
    if(this.props.queue.all.length == 0) {
      return(
        <label className="center noselect">
          Nothing in Queue
        </label>
      );
    }

    return this.props.queue.all.map((item) => {
      return(
        <QueueDetail
          key={`${item.modified}${item.checked}${item.raw}${item.people}`}
          queue={item}
          saveToQueue={(item) => this.props.saveToQueue(item)}
          userList={this.props.userList}
          sendMessage={(msg) => this.props.sendMessage(msg)}
          ready={this.props.ready}
          removeFromQueue={(item) => this.props.removeFromQueue(item)}
        />
      );
    });
  }


  render () {
    return (
      <Menu className="z-depth-3"
        customBurgerIcon={ false }
        customCrossIcon={ false }
        right
        isOpen={ this.props.queue.isOpen }
        onStateChange={(state) => this.updateState(state) }
        Menu width={ '55%' }

      >
        <ul>
          {this.renderQueue()}
        </ul>

      </Menu>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ updateBurger, saveToQueue, removeFromQueue, preloadQueue }, dispatch);
}

function mapStatesToProps(state) {
  return { queue: state.queue };
}

export default connect(mapStatesToProps, mapDispatchToProps)(QueueList);
