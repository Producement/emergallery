import React, { Component } from 'react';
import Gallery from './components/Gallery';
import Upload from './components/Upload';
import { withFirebase } from './components/Firebase';
import { HashRouter, Route } from 'react-router-dom';
import Stream from './components/Stream';
import Index from './components/Index';

class App extends Component<any, any> {
  render() {
    return (
      <HashRouter>
        <div className="container-fluid">
          <Route exact path="/" component={Index} />
          <Route path="/event/:id" component={Gallery} />
          <Route path="/upload/:id" component={Upload} />
          <Route path="/stream/:id" component={Stream} />
        </div>
      </HashRouter>
    );
  }
}

export default withFirebase(App);
