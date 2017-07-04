import '../assets/css/App.css';
import React, { Component } from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppBarCUST from './app_barcust';

class App extends Component {
  render() {
    return (
      <MuiThemeProvider>
        <div>
          <AppBarCUST />
          <h1>Hello, Electron!</h1>
          <p>I hope you enjoy using basic-electron-react-boilerplate to start your dev off right!</p>
        </div>
      </MuiThemeProvider>
    );
  }
}

export default App;
