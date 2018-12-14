import React, { Component } from 'react';
import { withRouter } from 'react-router';
import ReactGallery from 'react-photo-gallery';
import { withFirebase } from '../Firebase';
import Lightbox from 'react-images';
import { ReceivingPeer } from '../Video';
import './Gallery.css';
import man from './man01.png';
import bull from '../../bull.svg';
import { HashLink } from 'react-router-hash-link';

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
      <section id="pildid">
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
    this.state = {
      images: [],
      event: null
    };
    this.goBack = this.goBack.bind(this);
  }

  private dummyImage(i: number) {
    return {
      key: i,
      src:
        'https://www.echelonchicago.com/wp-content/uploads/2014/06/dummy.gif',
      width: 500,
      height: 271
    };
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
      let i = 0;
      while (images.length < 4) {
        images.push(this.dummyImage(i++));
      }
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
        <div className="h-100">
          <div className="container section">
            <div className="row">
              <div className="col-lg-6 offset-lg-3 col-md-8 offset-md-2 col-sm-12">
                <div className="text-center my-4 p-4 bg-white rounded shadow-sm">
                  <div className="sk-circle">
                    <div className="sk-circle1 sk-child" />
                    <div className="sk-circle2 sk-child" />
                    <div className="sk-circle3 sk-child" />
                    <div className="sk-circle4 sk-child" />
                    <div className="sk-circle5 sk-child" />
                    <div className="sk-circle6 sk-child" />
                    <div className="sk-circle7 sk-child" />
                    <div className="sk-circle8 sk-child" />
                    <div className="sk-circle9 sk-child" />
                    <div className="sk-circle10 sk-child" />
                    <div className="sk-circle11 sk-child" />
                    <div className="sk-circle12 sk-child" />
                  </div>

                  <h3>
                    <i className="fa fa-phone" aria-hidden="true" />{' '}
                    {this.getPhone() || 'Inimene'}
                  </h3>
                  <h6 className="text-secondary mb-4">
                    pole veel linki avanud
                  </h6>
                  <button
                    className="btn btn-primary btn-back"
                    onClick={this.goBack}
                  >
                    Tagasi
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }
    return (
      <div className="container">
        <div className="row profile">
          <div className="col-md-3 sidebar">
            <div className="sidebar-sticky">
              <div className="main-section text-center">
                <div className="profile-header" />
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
                <div className="user-social-detail" />
              </div>

              <div className="profile-usermenu">
                <ul className="nav flex-column">
                  <li className="nav-item">
                    <HashLink className="nav-link active" to="#pildid">
                      <i className="fa fa-picture-o" aria-hidden="true" />
                      Pildid <span className="sr-only">(current)</span>
                    </HashLink>
                  </li>
                  <li className="nav-item">
                    <HashLink className="nav-link" to="#video">
                      <i className="fa fa-video-camera" aria-hidden="true" />
                      Video
                    </HashLink>
                  </li>
                  <li className="nav-item">
                    <HashLink className="nav-link" to="#waze">
                      <i className="fa fa-car" aria-hidden="true" />
                      Waze
                    </HashLink>
                  </li>
                  <li className="nav-item">
                    <HashLink className="nav-link" to="#twitter">
                      <i className="fa fa-twitter" aria-hidden="true" />
                      Twitter
                    </HashLink>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="col-md-9">
            <div className="profile-content">
              <div className="container">
                {this.state.images.length > 0 && (
                  <SubGallery photos={this.state.images} />
                )}

                <section id="video">
                  <div className="row section">
                    <div className="col-lg-12 text-center">
                      <div className="title-box">
                        <p className="title-alt">Video</p>
                        <h3
                          className="fadeIn animated wow"
                          data-wow-delay=".1s"
                        >
                          Live videoülekanne
                        </h3>
                        <div className="border" />
                      </div>
                    </div>
                  </div>
                  <ReceivingPeer />
                </section>

                {this.getLatitude() && this.getLongitude() && (
                  <div>
                    <section id="waze">
                      <div className="row section">
                        <div className="col-lg-12 text-center">
                          <div className="title-box">
                            <p className="title-alt">Waze</p>
                            <h3
                              className="fadeIn animated wow"
                              data-wow-delay=".1s"
                            >
                              Sündmused kaardil
                            </h3>
                            <div className="border" />
                          </div>
                        </div>
                      </div>
                      <div className="embed-responsive embed-responsive-16by9">
                        <iframe
                          allowFullScreen
                          frameBorder="0"
                          src="https://embed.waze.com/iframe?zoom=14&lat=59.438698&lon=24.729117&ct=livemap"
                        />
                      </div>
                    </section>

                    <section id="twitter">
                      <div className="row section">
                        <div className="col-lg-12 text-center">
                          <div className="title-box">
                            <p className="title-alt">Twitter</p>
                            <h3
                              className="fadeIn animated wow"
                              data-wow-delay=".1s"
                            >
                              Säutsud kaardil
                            </h3>
                            <div className="border" />
                          </div>
                        </div>
                      </div>
                      <div className="embed-responsive embed-responsive-16by9">
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
            </div>
          </div>
        </div>
        <footer className="section bg-gray footer">
          <div className="container">
            <div className="row">
              <div className="col-lg-12">
                <div className="footer-alt">
                  <div className="float-left pull-none ">
                    <span className="navbar-brand logo">
                      <img src={bull} alt="" /> <span>Producement</span>
                    </span>
                  </div>
                  <div className="float-right pull-none ">
                    <p className="pull-right text-muted m-b-0">
                      2018 &copy;{' '}
                      <a href="https://producement.com">Producement.com</a>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </footer>
      </div>
    );
  }
}

export default withRouter(withFirebase(Gallery));
