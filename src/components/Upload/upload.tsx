import React from 'react';
import uuid from 'uuid/v4';
import { withFirebase } from '../Firebase';
import { InitiatorPeer } from '../Video';

class Upload extends React.Component<any, any> {
  render() {
    return (
      <div className="App">
        <div className="input-group mb-3">
          <div className="custom-file">
            <input
              type="file"
              className="custom-file-input"
              id="inputGroupFile02"
              onChange={this.handleSelectedFile}
            />
            <label
              className="custom-file-label"
              htmlFor="inputGroupFile02"
              aria-describedby="inputGroupFileAddon02"
            >
              Upload picture
            </label>
          </div>
          <div className="input-group-append">
            <span className="input-group-text" id="inputGroupFileAddon02">
              Upload
            </span>
          </div>
        </div>
        <InitiatorPeer />
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
