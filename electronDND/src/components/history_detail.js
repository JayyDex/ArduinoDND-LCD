import React from 'react';
import '../assets/css/history_detail.css';

const UniqueLabel = (data, props) => {
  var UserList = '';
  if (data == 100) {
    return('All');
  }
  data.forEach((data) => {
    props.userList.forEach((user) => {
      if(data == user[0]) {
        UserList = UserList.concat(user[1]);
        UserList = UserList.concat(',');
      }
    })
  });
  UserList = UserList.substring(0, UserList.length - 1);
  return(UserList);
}

const sendMessageManage = (props) => {
  if (props.ready != 1) {
    console.log("Not Ready for next Msg");
    return;
  } else {
    props.sendMessage(props.message.modified);
  }
}

const HistoryDetail = (props) => {
  var people = props.message.people;
  var raw = props.message.raw;
  var modified = props.message.modified;

  return(
    <li>
      <div>
        <label className='title'>
          {UniqueLabel(people, props)}
        </label>
      </div>
      <div className='row listHeight'>
        <label className='col s10'>
          {raw}
        </label>
        <div className='col s2'>
          <button className='btn historySendBtn waves-light waves-effect center-align' onClick={sendMessageManage.bind(this, props)}>
            <i className='material-icons'>keyboard_arrow_right</i>
          </button>
        </div>
      </div>
      <div className="divider"></div>
    </li>
  );
}

export default HistoryDetail;
