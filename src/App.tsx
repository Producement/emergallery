import React, { Component } from 'react';
import Gallery from './components/Gallery';
import Upload from './components/Upload';
import { withFirebase } from './components/Firebase';
import { HashRouter, Route } from 'react-router-dom';
import './App.css';

class App extends Component<any, any> {
  render() {
    return (
      <HashRouter>
        <div>
          <Route path="/event/:id" component={Gallery} />
          <Route path="/upload/:id" component={Upload} />
        </div>
      </HashRouter>
    );
  }
}

export default withFirebase(App);
