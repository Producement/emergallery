import React, { Component } from 'react';
import { withRouter } from 'react-router';
import ReactGallery from 'react-photo-gallery';
import { withFirebase } from '../Firebase';
import Lightbox from 'react-images';
import { ReceivingPeer } from '../Video';
import './Gallery.css';
import man from './man01.png';
import bull from './bull.svg';

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
        <div className="row section">
          <div className="col-lg-12 text-center">
            <div className="title-box">
              <p className="title-alt">Pildid</p>
              <h3 className="fadeIn animated wow" data-wow-delay=".1s">
                Üleslaetud pildid
              </h3>
              <div className="border" />
            </div>
          </div>
        </div>

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
    this.goBack = this.goBack.bind(this);
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

  private getLongitude() {
    if (this.state.event && this.state.event.location) {
      return this.state.event.location.longitude;
    }
  }

  private getLatitude() {
    if (this.state.event && this.state.event.location) {
      return this.state.event.location.latitude;
    }
  }

  private getAddress() {
    if (this.state.event && this.state.event.address) {
      return this.state.event.address;
    }
  }

  private getPhone() {
    if (this.state.event) {
      return this.state.event.phoneNr;
    }
  }

  private goBack() {
    this.props.history.push('/');
  }

  render() {
    if (!this.state.event || !this.state.event.startTime) {
      return (
        <div className="container section h-100">
          <div className="row justify-content-md-center">
            <div className="col-md-auto">
              <h1>{this.getPhone() || 'Kasutaja'} pole veel linki avanud</h1>
            </div>
          </div>
          <div className="row justify-content-md-center">
            <div className="col-md-auto">
              <button className="btn btn-primary" onClick={this.goBack}>
                Tagasi
              </button>
            </div>
          </div>
        </div>
      );
    }
    return (
      <div className="container">
        {this.state.images.length > 0 && (
          <SubGallery photos={this.state.images} />
        )}

        <section>
          <div className="row section">
            <div className="col-lg-12 text-center">
              <div className="title-box">
                <p className="title-alt">Video</p>
                <h3 className="fadeIn animated wow" data-wow-delay=".1s">
                  Üleslaetud klipid
                </h3>
                <div className="border" />
              </div>
            </div>
          </div>
          <ReceivingPeer />
        </section>

        <div className="row section">
          <div className="col-lg-12 text-center">
            <div className="title-box">
              <p className="title-alt">Inimene</p>
              <h3 className="fadeIn animated wow" data-wow-delay=".1s">
                Inimese profiil
              </h3>
              <div className="border" />
            </div>
          </div>
        </div>

        <div className="offset-lg-4 col-lg-4 col-sm-6 col-12 main-section text-center">
          <div className="row">
            <div className="col-lg-12 col-sm-12 col-12 profile-header" />
          </div>
          <div className="row user-detail">
            <div className="col-lg-12 col-sm-12 col-12">
              <img src={man} className="rounded-circle img-thumbnail" />
              <h5>{this.getPhone()}</h5>
              <p>
                <i className="fa fa-map-marker" aria-hidden="true" />{' '}
                {this.getAddress() || 'Ei ole saadaval'}
              </p>
              <hr />
              <p>
                <i className="fa fa-compass" aria-hidden="true" />{' '}
                {this.getLatitude() || 'Ei ole saadaval'}
              </p>
              <p>
                <i className="fa fa-globe" aria-hidden="true" />{' '}
                {this.getLongitude() || 'Ei ole saadaval'}
              </p>
            </div>
          </div>
          <div className="row user-social-detail" />
        </div>

        {this.getLatitude() && this.getLongitude() && (
          <div>
            <section>
              <div className="row section">
                <div className="col-lg-12 text-center">
                  <div className="title-box">
                    <p className="title-alt">Waze</p>
                    <h3 className="fadeIn animated wow" data-wow-delay=".1s">
                      Sündmused kaardil
                    </h3>
                    <div className="border" />
                  </div>
                </div>
              </div>
              <div className="embed-responsive embed-responsive-21by9">
                <iframe
                  allowFullScreen
                  frameBorder="0"
                  src="https://embed.waze.com/iframe?zoom=14&lat=59.438698&lon=24.729117&ct=livemap"
                />
              </div>
            </section>

            <section>
              <div className="row section">
                <div className="col-lg-12 text-center">
                  <div className="title-box">
                    <p className="title-alt">Twitter</p>
                    <h3 className="fadeIn animated wow" data-wow-delay=".1s">
                      Säutsud kaardil
                    </h3>
                    <div className="border" />
                  </div>
                </div>
              </div>
              <div className="embed-responsive embed-responsive-21by9">
                <iframe
                  allowFullScreen
                  frameBorder="0"
                  src="https://twimap.com/?embed=true&location=59.438698%2C24.729117&zoom=15&distance=500&count=100&min_timestamp=0&max_timestamp=0"
                />
              </div>
            </section>
          </div>
        )}

        <div className="section" />
      </div>
    );
  }
}

export default withRouter(withFirebase(Gallery));
