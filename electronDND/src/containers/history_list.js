import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import '../assets/css/history_list.css';
import HistoryDetail from '../components/history_detail';

class HistoryList extends Component {
  constructor(props) {
    super(props);
  }

  renderHistory() {
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

  render() {
    return(
      <div>
        <label className='histroylbl'>History</label>
        <ul>
          {this.renderHistory()}
        </ul>
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
