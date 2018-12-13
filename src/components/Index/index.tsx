import React from 'react';
import { withRouter } from 'react-router-dom';
import { withFirebase } from '../Firebase';
import uuid from 'uuid/v4';

class Index extends React.Component<any, any> {
  constructor(props) {
    super(props);
    this.state = { value: '' };
    this.handleChange = this.handleChange.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
  }

  private createEvent() {
    const id = uuid();
    const eventDoc = this.props.firebase
      .firestore()
      .collection('events')
      .doc(id)
      .set({ phoneNr: this.state.value });
    return id;
  }

  private sendSms() {
    const id = this.createEvent();
    const message = `Palun avage link https://emergallery.producement.com/#/event/${id}`;
    fetch(
      `http://localhost:5000/g48riik/us-central1/messages/messages?to=${
        this.state.value
      }&message=${message}`
    )
      .then(response => console.log(response.body))
      .catch(error => console.log(error));
    return id;
  }

  handleChange(e) {
    this.setState({ value: e.target.value });
  }

  handleKeyPress(e) {
    if (e.key === 'Enter') {
      const id = this.sendSms();
      this.props.history.push(`/event/${id}`);
    }
  }

  render() {
    return (
      <div>
        <div className="row justify-content-center align-items-center">
          <div className="col">
            <h1 className="display-4 text-center">Häirekeskuse Pildipank</h1>
          </div>
        </div>
        <div className="row justify-content-center align-items-center">
          <div className="col-4">
            <div className="form-group">
              <input
                className="form-control"
                id="inputlg"
                type="text"
                placeholder="Sisesta mobiilinumber ja vajuta enter"
                onKeyPress={this.handleKeyPress}
                onChange={this.handleChange}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(withFirebase(Index));
