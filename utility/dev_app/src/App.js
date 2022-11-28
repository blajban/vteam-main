import React, { Component } from 'react';
import EventEmitter from './EventEmitter';

class App extends Component {
    render() {
      return (
          <React.StrictMode>
             <EventEmitter />
          </React.StrictMode>
      );
    }
  }
  
  export default App;