import React, { Component } from 'react';
import Gallery from './components/Gallery';
import Upload from './components/Upload';
import { withFirebase } from './components/Firebase';
import { HashRouter, Route } from 'react-router-dom';
import Index from './components/Index';
import bull from './bull.svg';

class App extends Component<any, any> {
  render() {
    return (
      <HashRouter>
        <div className="h-100">
          <Route exact path="/" component={Index} />
          <Route path="/event/:id" component={Gallery} />
          <Route path="/upload/:id" component={Upload} />
          <footer className="section bg-gray footer">
            <div className="container">
              <div className="row">
                <div className="col-lg-12">
                  <div className="footer-alt">
                    <div className="float-left pull-none ">
                      <span className="navbar-brand logo">
                        <img src={bull} alt="" /> <span>Producement</span>
                      </span>
                    </div>
                    <div className="float-right pull-none ">
                      <p className="pull-right text-muted m-b-0">
                        2018 &copy;{' '}
                        <a href="https://producement.com">Producement.com</a>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </footer>
        </div>
      </HashRouter>
    );
  }
}

export default withFirebase(App);
