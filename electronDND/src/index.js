import React from 'react';
import { render } from 'react-dom';
import App from './components/app';

// Since we are using HtmlWebpackPlugin WITHOUT a template, we should create our own root node in the body element before rendering into it
let root = document.createElement('div');
root.id = "root";
document.body.appendChild( root );

var materialize = document.createElement('script');
materialize.setAttribute('src','https://cdnjs.cloudflare.com/ajax/libs/materialize/0.99.0/js/materialize.min.js');
document.head.appendChild(materialize);

var icons = document.createElement('link');
icons.setAttribute('href', 'https://fonts.googleapis.com/icon?family=Material+Icons');
icons.setAttribute('rel', 'stylesheet');
document.head.appendChild(icons);



// Now we can render our application into it
render( <App />, document.getElementById('root') );
