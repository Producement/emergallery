import React from 'react';
import uuid from 'uuid/v4';
import { withFirebase } from '../Firebase';
import { InitiatorPeer } from '../Video';

class Upload extends React.Component<any, any> {
  render() {
    return (
      <div className="App">
        <input type="file" name="" id="" onChange={this.handleselectedFile} />
        <InitiatorPeer />
      </div>
    );
  }

  handleselectedFile = (event: any) => {
    const selectedFile = event.target.files[0];
    const { firebase, match } = this.props;
    const eventId = match.params.id;
    const storage = firebase.storage();
    const id = uuid();
    const ref = storage.ref().child(id);
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
          .set({ width: 1, height: 1, src: url });
      });
    });
  };
}

export default withFirebase(Upload);
