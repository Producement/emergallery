import React from 'react';
import { withFirebase } from '../Firebase';
import uuid from 'uuid/v4';

class Stream extends React.Component<any, any> {
  countdown: any;

  constructor(props) {
    super(props);
    this.sendTwitter = this.sendTwitter.bind(this);
    this.sendTwitterInit = this.sendTwitterInit.bind(this);
    this.stopTwitter = this.stopTwitter.bind(this);
  }
  sendTwitter() {
    const eventDoc = this.props.firebase
      .firestore()
      .collection('events')
      .doc(this.props.match.params.id);

    eventDoc
      .collection('twitter')
      .doc(uuid())
      .set({
        width: 1,
        height: 1,
        src: 'https://producement.com/img/erko.jpg'
      });
  }

  sendTwitterInit() {
    this.countdown = setInterval(this.sendTwitter, 2000);
  }

  stopTwitter() {
    clearInterval(this.countdown);
  }

  render() {
    return (
      <div>
        <button onClick={this.sendTwitterInit}>Send Twitter images</button>
        <button onClick={this.stopTwitter}>Stop Twitter images</button>
      </div>
    );
  }
}

export default withFirebase(Stream);
