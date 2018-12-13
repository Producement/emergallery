import React from 'react';
import uuid from 'uuid/v4';
import { withFirebase } from '../Firebase';

class Upload extends React.Component<any, any> {
  handleselectedFile = event => {
    this.setState({
      selectedFile: event.target.files[0],
      loaded: 0
    });
  };

  handleUpload = () => {
    const { firebase, match } = this.props;
    const event = match.params.id;
    const storage = firebase.storage();
    const id = uuid();
    const ref = storage.ref().child(id);
    ref.put(this.state.selectedFile).then(function(snapshot) {
      console.log('Saved file');
      snapshot.ref.getDownloadURL().then(function(url) {
        console.log(url);
        firebase
          .firestore()
          .collection('events')
          .doc(event)
          .collection('images')
          .doc(id)
          .set({ width: 1, height: 1, src: url });
      });
    });
  };

  render() {
    return (
      <div className="App">
        <input type="file" name="" id="" onChange={this.handleselectedFile} />
        <button onClick={this.handleUpload}>Upload</button>
      </div>
    );
  }
}

export default withFirebase(Upload);
