import React, { Component } from 'react';
import Gallery from './components/Gallery';
import Upload from './components/Upload';
import { withFirebase } from './components/Firebase';
import { HashRouter, Route } from 'react-router-dom';

class App extends Component<any, any> {
  render() {
    return (
      <HashRouter>
        <div className="container-fluid">
          <Route path="/event/:id" component={Gallery} />
          <Route path="/upload/:id" component={Upload} />
        </div>
      </HashRouter>
    );
  }
}

export default withFirebase(App);
