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
            <div className="input-group mb-3">
              <div className="custom-file">
                <input
                  style={{ display: 'none' }}
                  type="file"
                  className="custom-file-input"
                  id="inputGroupFile02"
                  onChange={this.handleSelectedFile}
                />
                <label
                  style={{ display: 'none' }}
                  className="custom-file-label"
                  htmlFor="inputGroupFile02"
                  aria-describedby="inputGroupFileAddon02"
                >
                  LISA PILT
                </label>
              </div>
              <div className="input-group">
                <span className="input-group-text" id="inputGroupFileAddon02">
                  LISA PILT
                </span>
              </div>
            </div>
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
