import React, { Component } from 'react';
import { slide as Menu } from 'react-burger-menu'
import '../assets/css/queue_list.css';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { updateBurger, saveToQueue } from '../actions/index';
import QueueDetail from '../components/queue_detail';

class QueueList extends Component {
  constructor(props) {
    super(props);
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
          key={`${item.modified}${item.checked}`}
          queue={item}
          saveToQueue={(item) => this.props.saveToQueue(item)}
          userList={this.props.userList}
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
  return bindActionCreators({ updateBurger, saveToQueue }, dispatch);
}

function mapStatesToProps(state) {
  return { queue: state.queue };
}

export default connect(mapStatesToProps, mapDispatchToProps)(QueueList);
