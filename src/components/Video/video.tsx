import React from 'react';
import Peer from 'simple-peer';
import { withFirebase } from '../Firebase';
import uuid from 'uuid/v4';
import { withRouter } from 'react-router';

class ReceivingPeerComponent extends React.Component<any, any> {
  liveVideo: HTMLVideoElement | null = null;

  constructor(props) {
    super(props);
    this.screenshot = this.screenshot.bind(this);
    this.init = this.init.bind(this);
  }

  componentDidMount() {
    this.init();
  }

  private init() {
    const { firebase, match } = this.props;
    const eventId = match.params.id;
    console.log('Initialising peer');
    var peer2 = new Peer();

    peer2.on('signal', data => {
      console.log('Peer2 signal');
      firebase
        .firestore()
        .collection('peers')
        .doc(`${eventId}#1`)
        .set({ data });
    });

    peer2.on('stream', stream => {
      console.log('Stream');
      if (this.liveVideo) {
        this.liveVideo.src = window.URL.createObjectURL(stream);
        this.liveVideo.play();
      }
    });

    const unsubscribe = firebase
      .firestore()
      .collection('peers')
      .doc(`${eventId}#2`)
      .onSnapshot((snapshot: any) => {
        if (snapshot.data()) {
          const data = snapshot.data().data;
          if (data) {
            console.log('Sending data');
            peer2.signal(data);
          }
        }
      });

    const reset = e => {
      console.log(`Closing peer2 ${e}`);
      unsubscribe();
      firebase
        .firestore()
        .collection('peers')
        .doc(`${eventId}#1`)
        .set({ data: '' });
      this.init();
    };

    peer2.on('error', reset);

    peer2.on('close', console.log);
  }

  screenshot() {
    const canvas = document.createElement('canvas');
    if (canvas) {
      const video: any = this.liveVideo;
      canvas.width = video.clientWidth;
      canvas.height = video.clientHeight;
      const ctx: any = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      const { firebase, match } = this.props;
      const eventId = match.params.id;
      const storage = firebase.storage();
      const id = uuid();
      const ref = storage.ref().child(id);

      canvas.toBlob(blob => {
        ref.put(blob).then(function(snapshot) {
          console.log('Saved file');
          snapshot.ref.getDownloadURL().then(function(url) {
            console.log(url);
            firebase
              .firestore()
              .collection('events')
              .doc(eventId)
              .collection('images')
              .doc(id)
              .set({ width: canvas.width, height: canvas.height, src: url });
          });
        });
      });
    }
  }

  render() {
    return (
      <div>
        <video
          ref={input => {
            this.liveVideo = input;
          }}
        />
        <button className="btn btn-info" onClick={this.screenshot}>
          Tee pilt
        </button>
      </div>
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
    const { firebase, match } = this.props;
    const eventId = match.params.id;
    console.log('Got media, initialising peer');
    var peer1 = new Peer({ initiator: true, trickle: false, stream: stream });

    peer1.on('signal', data => {
      console.log('Peer1 signal');
      firebase
        .firestore()
        .collection('peers')
        .doc(`${eventId}#2`)
        .set({ data });
    });

    const unsubscribe = firebase
      .firestore()
      .collection('peers')
      .doc(`${eventId}#1`)
      .onSnapshot((snapshot: any) => {
        if (snapshot.data()) {
          const data = snapshot.data().data;
          if (data) {
            console.log('Sending data');
            peer1.signal(data);
          }
        }
      });

    peer1.on('error', e => {
      unsubscribe();
      console.log(`Closing peer1 ${e}`);
      firebase
        .firestore()
        .collection('peers')
        .doc(`${eventId}#2`)
        .set({ data: '' });
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
    return (
      <button className="btn btn-info" onClick={this.initiate}>
        LISA VIDEO
      </button>
    );
  }
}

const InitiatorPeer = withRouter(withFirebase(InitiatorPeerComponent));
const ReceivingPeer = withRouter(withFirebase(ReceivingPeerComponent));

export { InitiatorPeer, ReceivingPeer };
