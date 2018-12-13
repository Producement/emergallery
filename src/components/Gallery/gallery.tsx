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
    this.state = { images: [], event: null };
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
        images: images,
        event: this.state.event
      });
    });

    eventDoc.onSnapshot(snapshot => {
      this.setState({
        images: this.state.images,
        event: snapshot.data()
      });
    });
  }

  private getLocation() {
    if (this.state.event && this.state.event.location) {
      return `${this.state.event.location.latitude}, ${
        this.state.event.location.longitude
      }`;
    }
    return 'Ei ole saadaval';
  }

  private getAddress() {
    if (this.state.event && this.state.event.address) {
      return this.state.event.address;
    }
    return 'Ei ole saadaval';
  }

  private getPhone() {
    if (this.state.event) {
      return this.state.event.phoneNr;
    }
    return 'Ei ole saadaval';
  }

  render() {
    return (
      <div>
        <section>
          <h1 className="heading">Andmed</h1>
          <p>Telefon: {this.getPhone()}</p>
          <p>Aadress: {this.getAddress()}</p>
          <p>Asukoht: {this.getLocation()}</p>
        </section>

        <SubGallery title="Pildid" photos={this.state.images} />

        <section>
          <h1 className="heading">Video</h1>
          <ReceivingPeer />
        </section>

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
