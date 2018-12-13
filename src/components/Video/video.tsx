import React from 'react';
import Peer from 'simple-peer';
import { withFirebase } from '../Firebase';

class ReceivingPeerComponent extends React.Component<any, any> {
  liveVideo: HTMLVideoElement | null = null;

  componentDidMount() {
    var peer2 = new Peer();

    peer2.on('signal', data => {
      console.log('Peer2 signal');
      console.log(data);
      this.props.firebase
        .firestore()
        .collection('peers')
        .doc('peer1')
        .set({ data });
    });

    peer2.on('stream', stream => {
      console.log('Stream');
      if (this.liveVideo) {
        this.liveVideo.src = window.URL.createObjectURL(stream);
        this.liveVideo.play();
      }
    });

    this.props.firebase
      .firestore()
      .collection('peers')
      .doc('peer2')
      .onSnapshot((snapshot: any) => {
        console.log(snapshot.data());
        peer2.signal(snapshot.data().data);
      });
  }
  render() {
    return (
      <video
        ref={input => {
          this.liveVideo = input;
        }}
      />
    );
  }
}

class InitiatorPeerComponent extends React.Component<any, any> {
  constructor(props) {
    super(props);
    this.gotMedia = this.gotMedia.bind(this);
    this.initiate = this.initiate.bind(this);
  }

  gotMedia(stream) {
    console.log('Got media');
    var peer1 = new Peer({ initiator: true, stream: stream });

    peer1.on('signal', data => {
      console.log('Peer1 signal');
      this.props.firebase
        .firestore()
        .collection('peers')
        .doc('peer2')
        .set({ data });
    });

    this.props.firebase
      .firestore()
      .collection('peers')
      .doc('peer1')
      .onSnapshot((snapshot: any) => {
        console.log(snapshot.data());
        peer1.signal(snapshot.data().data);
      });
  }

  initiate() {
    navigator.getUserMedia(
      { video: true, audio: true },
      this.gotMedia,
      function() {}
    );
  }
  render() {
    return <button onClick={this.initiate}>Video</button>;
  }
}

const InitiatorPeer = withFirebase(InitiatorPeerComponent);
const ReceivingPeer = withFirebase(ReceivingPeerComponent);

export { InitiatorPeer, ReceivingPeer };
