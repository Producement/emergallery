import React from 'react';
import { withRouter } from 'react-router-dom';
import { withFirebase } from '../Firebase';
import uuid from 'uuid/v4';
import './home.css';

class Index extends React.Component<any, any> {
  constructor(props) {
    super(props);
    this.state = { value: '' };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
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

  handleSubmit(e) {
    const id = this.sendSms();
    this.props.history.push(`/event/${id}`);
    e.preventDefault();
  }

  render() {
    return (
      <div>
        <section className="home h-100" id="home">
          <div className="container">
            <div className="row">
              <div className="col-lg-12">
                <div className="home-wrapper text-center">
                  <h1 className="animated fadeInDown wow" data-wow-delay=".1s">
                    Häirekeskuse pildipank ehk{' '}
                    <span className="text-colored">Pipa</span>
                  </h1>
                  <div className="row">
                    <div className="col-sm-10 offset-sm-1">
                      <p
                        className="animated fadeInDown wow text-muted"
                        data-wow-delay=".2s"
                      >
                        Sisesta siia inimese <strong>mobiilinumber</strong> ja
                        saada talle sõnumiga link,
                        <br />
                        kuhu ta saab laadida pilte ja videoklippe.
                      </p>
                    </div>
                  </div>
                  <div className="text-center subscribe-form">
                    <form onSubmit={this.handleSubmit}>
                      <input
                        type="text"
                        placeholder="5650 4590"
                        onChange={this.handleChange}
                      />
                      <button type="submit">Saada</button>
                    </form>
                  </div>

                  <div className="clearfix" />
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }
}

export default withRouter(withFirebase(Index));
