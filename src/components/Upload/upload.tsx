import React from 'react';
import uuid from 'uuid/v4';
import { withFirebase } from '../Firebase';
import { InitiatorPeer } from '../Video';
import { firestore } from 'firebase';

class GeoLocator extends React.Component<any, any> {
  componentDidMount() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        const eventId = this.props.match.params.id;
        console.log(position);
        this.props.firebase
          .firestore()
          .collection('events')
          .doc(eventId)
          .set({
            location: new firestore.GeoPoint(
              59.438698, //position.coords.latitude,
              24.729117 //position.coords.longitude
            ),
            address: 'Telliskivi 60a, Tallinn'
          });
      }, console.log);
    } else {
      console.log('Error');
    }
  }

  render() {
    return <div />;
  }
}

class Upload extends React.Component<any, any> {
  componentDidMount() {
    const { firebase, match } = this.props;
    const eventId = match.params.id;
    firebase
      .firestore()
      .collection('events')
      .doc(eventId)
      .set({ startTime: Date() }, { merge: true });
  }

  render() {
    return (
      <div className="App">
        <GeoLocator />
        <div className="row">
          <div className="col-md-12 text-center">
            <h1>Häirekeskuse Pildipank</h1>
          </div>
        </div>
        <div className="row">
          <div className="col-md-12 text-center">
            <label>
              <input
                style={{ display: 'none' }}
                type="file"
                onChange={this.handleSelectedFile}
              />
              <span className="btn btn-info">LISA PILT</span>
            </label>
          </div>
        </div>
        <div className="row">
          <div className="col-md-12 text-center">
            <InitiatorPeer />
          </div>
        </div>
      </div>
    );
  }

  handleSelectedFile = (event: any) => {
    const selectedFile = event.target.files[0];
    const { firebase, match } = this.props;
    const eventId = match.params.id;
    const storage = firebase.storage();
    const id = uuid();
    const ref = storage.ref().child(id);

    let width = 1;
    let height = 1;
    if (selectedFile) {
      const img = new Image();

      img.src = window.URL.createObjectURL(selectedFile);

      img.onload = function() {
        width = img.naturalWidth;
        height = img.naturalHeight;

        window.URL.revokeObjectURL(img.src);
      };
    }

    ref.put(selectedFile).then(function(snapshot) {
      console.log('Saved file');
      snapshot.ref.getDownloadURL().then(function(url) {
        console.log(url);
        firebase
          .firestore()
          .collection('events')
          .doc(eventId)
          .collection('images')
          .doc(id)
          .set({ width: width, height: height, src: url });
      });
    });
  };
}

export default withFirebase(Upload);
