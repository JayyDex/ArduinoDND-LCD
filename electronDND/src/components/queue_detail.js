import React from 'react';
import '../assets/css/queue_detail.css';

const UniqueLabel = (data, props) => {
  var UserList = '';
  if (data == 100) {
    return('All');
  }
  data.forEach((data) => {
    props.userList.forEach((user) => {
      if(data == user[0]) {
        UserList = UserList.concat(user[1]);
        UserList = UserList.concat(', ');
      }
    })
  });
  UserList = UserList.substring(0, UserList.length - 1);
  UserList = UserList.substring(0, UserList.length - 1);
  return(UserList);
}

const QueueDetail = (props) => {
  return(
    <li className='row detailContainer z-depth-2'>
      <div className='col s10 titleBar'>
        <div className={`${props.queue.checked ? 'boxGreen' : 'boxOrange'}`}>

        </div>
        <label className='titleText noselect'>{UniqueLabel(props.queue.people, props)}</label>

        <div className='checkBoxQueue' onClick={props.saveToQueue.bind(this, props.queue)}>
          <input
            type="checkbox"
            className='checkbox-indigo'
            id="filled-in-box"
            defaultChecked={props.queue.checked}
          />
          <label htmlFor="filled-in"></label>
        </div>
        <div className='mainText noselect'>
          <label>
            {props.queue.raw}
          </label>
        </div>
      </div>
      <button className='col s2 btn buttonQueue waves-effect waves-light' onClick={() => console.log('Send')}>
        <i className='material-icons absoluteShift'>keyboard_arrow_right</i>
      </button>
    </li>
  );
}

export default QueueDetail;
