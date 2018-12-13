import React from 'react';
import uuid from 'uuid/v4';
import { withFirebase } from '../Firebase';
import { InitiatorPeer } from '../Video';

class Upload extends React.Component<any, any> {
  render() {
    return (
      <div className="App">
        <input type="file" name="" id="" onChange={this.handleselectedFile} />
        <button onClick={this.sendSms}>Send SMS to Tõnu</button>
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

  private sendSms() {
    fetch(
      'http://localhost:5000/g48riik/us-central1/messages/messages?to=+37253044744&message=häirekeskus!!!11'
    )
      .then(response => console.log(response.body))
      .catch(error => console.log(error));
  }
}

export default withFirebase(Upload);
