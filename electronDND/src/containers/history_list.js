import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import ReactScrollbar from 'react-scrollbar-js';

import '../assets/css/history_list.css';
import HistoryDetail from '../components/history_detail';

class HistoryList extends Component {
  constructor(props) {
    super(props);
  }

  renderHistory() {
    if (this.props.history) {
      return this.props.history.map((message) => {
        return (
          <HistoryDetail
            key={message.modified}
            message={message}
            userList={this.props.userList}
            sendMessage={(msg) => this.props.sendMessage(msg)}
            ready={this.props.ready}
          />
        );
      });
    }

  }

  render() {

    const myScrollbar = {
      width: 430,
      height: 290,
    };

    return(
      <div>
        <label className='histroylbl noselect'>History</label>
        <ReactScrollbar>
          <ul className='scroll-me'>
            {this.renderHistory()}
          </ul>
        </ReactScrollbar>
      </div>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ }, dispatch);
}

function mapStatesToProps(state) {
  return { history: state.history };
}

export default connect(mapStatesToProps, mapDispatchToProps)(HistoryList);
