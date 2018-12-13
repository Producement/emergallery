import React, { Component } from 'react';
import Gallery from './components/Gallery';
import { withFirebase } from './components/Firebase';
import './App.css';

class App extends Component<any, any> {
  constructor(props) {
    super(props);
    this.state = { event: { id: 'S7FXwA766Nay1ymu0dcN' } };
  }

  componentDidMount() {
    const hash = window.location.hash || '#S7FXwA766Nay1ymu0dcN';
    this.props.firebase
      .firestore()
      .collection('events')
      .doc(hash.substring(1))
      .onSnapshot((snapshot: any) => {
        this.setState({
          event: snapshot.data()
        });
      });
  }

  render() {
    return <Gallery id={this.state.event.id} />;
  }
}

export default withFirebase(App);
