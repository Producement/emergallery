import React from 'react';
import uuid from 'uuid/v4';
import { withFirebase } from '../Firebase';
import { InitiatorPeer } from '../Video';

class Upload extends React.Component<any, any> {
  render() {
    return (
      <div className="App">
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
