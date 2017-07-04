import React, { Component } from 'react';
import AppBar from 'material-ui/AppBar';
import Chip from 'material-ui/Chip';
import {green700, lightBlue900} from 'material-ui/styles/colors';

const statusIcon = () => {
  return(
    <div>
      <Chip
        style={styles.chip}
        backgroundColor={green700}
      >
        Arduino Online
    </Chip>
    </div>
  );
}

class AppBarCUST extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return(
      <AppBar
        style={styles.app}
        title={statusIcon()}
        iconElementLeft={<div />}
      />
    );
  }
}

export default AppBarCUST;

const styles = {
  chip: {
    margin: 16,
  },
  app: {
    backgroundColor: lightBlue900
  }
};
