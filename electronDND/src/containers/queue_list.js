import React, { Component } from 'react';
import { slide as Menu } from 'react-burger-menu'
import '../assets/css/queue_list.css';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { updateBurger } from '../actions/index';

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
        <div key={item}>
          {item}
        </div>
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
        Menu width={ '40%' }

      >
        {this.renderQueue()}
      </Menu>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ updateBurger }, dispatch);
}

function mapStatesToProps(state) {
  return { queue: state.queue };
}

export default connect(mapStatesToProps, mapDispatchToProps)(QueueList);
