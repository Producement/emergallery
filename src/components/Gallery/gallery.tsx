import React, { Component } from 'react';
import { withRouter } from 'react-router';
import ReactGallery from 'react-photo-gallery';
import { withFirebase } from '../Firebase';
import Lightbox from 'react-images';
import { ReceivingPeer } from '../Video';
import './Gallery.css';

class SubGallery extends Component<any, any> {
  constructor(props) {
    super(props);
    this.state = { currentImage: 0 };
    this.closeLightbox = this.closeLightbox.bind(this);
    this.openLightbox = this.openLightbox.bind(this);
    this.gotoNext = this.gotoNext.bind(this);
    this.gotoPrevious = this.gotoPrevious.bind(this);
  }
  openLightbox(event, obj) {
    this.setState({
      currentImage: obj.index,
      lightboxIsOpen: true
    });
  }
  closeLightbox() {
    this.setState({
      currentImage: 0,
      lightboxIsOpen: false
    });
  }
  gotoPrevious() {
    this.setState({
      currentImage: this.state.currentImage - 1
    });
  }
  gotoNext() {
    this.setState({
      currentImage: this.state.currentImage + 1
    });
  }

  render() {
    return (
      <section>
        <h1 className="heading">{this.props.title}</h1>
        <ReactGallery photos={this.props.photos} onClick={this.openLightbox} />
        <Lightbox
          images={this.props.photos}
          onClose={this.closeLightbox}
          onClickPrev={this.gotoPrevious}
          onClickNext={this.gotoNext}
          currentImage={this.state.currentImage}
          isOpen={this.state.lightboxIsOpen}
        />
      </section>
    );
  }
}

class Gallery extends Component<any, any> {
  constructor(props) {
    super(props);
    this.state = { images: [] };
  }

  componentDidMount() {
    const eventDoc = this.props.firebase
      .firestore()
      .collection('events')
      .doc(this.props.match.params.id);

    eventDoc.collection('images').onSnapshot((snapshot: any) => {
      const images: Array<any> = [];
      snapshot.forEach(function(doc: any) {
        images.push(doc.data());
      });
      this.setState({
        images: images
      });
    });
  }

  private sendSms() {
    fetch(
      'http://localhost:5000/g48riik/us-central1/messages/messages?to=+37253044744&message=häirekeskus!!!11'
    )
      .then(response => console.log(response.body))
      .catch(error => console.log(error));
  }

  render() {
    return (
      <div>
        <ReceivingPeer />

        <section>
          <button className="btn btn-primary" onClick={this.sendSms}>
            Ask for pics via SMS
          </button>
        </section>

        <SubGallery title="Pildid" photos={this.state.images} />

        <section>
          <h1 className="heading">Waze</h1>
          <iframe
            width="600"
            height="450"
            allowFullScreen
            frameBorder="0"
            src="https://embed.waze.com/iframe?zoom=14&lat=59.438698&lon=24.729117&ct=livemap"
          />
        </section>

        <section>
          <h1 className="heading">Twitter</h1>
          <iframe
            width="600"
            height="450"
            frameBorder="0"
            src="https://twimap.com/?embed=true&location=59.438698%2C24.729117&zoom=15&distance=500&count=100&min_timestamp=0&max_timestamp=0"
          />
        </section>
      </div>
    );
  }
}

export default withRouter(withFirebase(Gallery));
