import React from 'react';
import { withRouter } from 'react-router-dom';

class Index extends React.Component<any, any> {
  constructor(props) {
    super(props);
    this.state = { value: '' };
    this.handleChange = this.handleChange.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
  }

  private sendSms() {
    fetch(
      'http://localhost:5000/g48riik/us-central1/messages/messages?to=+37253044744&message=häirekeskus!!!11'
    )
      .then(response => console.log(response.body))
      .catch(error => console.log(error));
  }

  private handleNumber() {}

  handleChange(e) {
    this.setState({ value: e.target.value });
  }

  handleKeyPress(e) {
    if (e.key === 'Enter') {
      this.sendSms();
      this.props.history.push('/event/S7FXwA766Nay1ymu0dcN');
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

export default withRouter(Index);
