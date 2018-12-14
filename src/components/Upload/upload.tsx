import React from 'react';
import uuid from 'uuid/v4';
import { withFirebase } from '../Firebase';
import { InitiatorPeer } from '../Video';
import * as firebase from 'firebase/app';

class Upload extends React.Component<any, any> {
  componentDidMount() {
    const { firebase, match } = this.props;
    const eventId = match.params.id;
    firebase
      .firestore()
      .collection('events')
      .doc(eventId)
      .set({ startTime: Date() }, { merge: true });
    this.locate();
  }

  private locate() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        const eventId = this.props.match.params.id;
        this.props.firebase
          .firestore()
          .collection('events')
          .doc(eventId)
          .set(
            {
              location: new firebase.firestore.GeoPoint(
                position.coords.latitude,
                position.coords.longitude
              )
            },
            { merge: true }
          );
      }, console.log);
    } else {
      console.log('Error');
    }
  }

  render() {
    return (
      <div className="login-page">
        <div className="container pt-5">
          <div className="row">
            <div className="col-lg-10 offset-lg-1 col-sm-12 offset-sm-0 text-center">
              <div className="col-lg-6 offset-lg-3 col-md-8 offset-md-2 col-sm-12">
                <div className="row mt-4 pt-4 pb-4 justify-content-center login-form">
                  <div className="col-lg-9">
                    <h3 className="mt-2 mb-4 pb-2">
                      <span>Häirekeskuse Pildipank</span>
                    </h3>
                    <form>
                      <div className="form-group">
                        <label style={{ width: '100%' }}>
                          <input
                            style={{ display: 'none' }}
                            type="file"
                            onChange={this.handleSelectedFile}
                          />
                          <span className="btn btn-primary btn-block btn-lg">
                            LISA PILT
                          </span>
                        </label>
                      </div>
                    </form>
                    <div className="login-form__break mt-3 mb-3">
                      <span className="ml-2 mr-2">
                        <span>või</span>
                      </span>
                    </div>
                    <div>
                      <InitiatorPeer />
                    </div>
                  </div>
                  <div className="col-lg-9 mt-4">
                    <span>
                      Pildi ning videomaterjal on vajalik hädaolukorrale
                      operatiivseks reageerimiseks.
                    </span>
                  </div>
                </div>
              </div>
            </div>
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
