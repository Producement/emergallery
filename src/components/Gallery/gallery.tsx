import React, { Component } from 'react';
import { withRouter } from 'react-router';
import ReactGallery from 'react-photo-gallery';
import { withFirebase } from '../Firebase';
import Lightbox from 'react-images';
import { ReceivingPeer } from '../Video';
import './Gallery.css';
import man from './man01.png';
import bull from '../../bull.svg';

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
                    <a className="nav-link active" href="#">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        className="feather feather-layers"
                      >
                        <polygon points="12 2 2 7 12 12 22 7 12 2" />
                        <polyline points="2 17 12 22 22 17" />
                        <polyline points="2 12 12 17 22 12" />
                      </svg>
                      Pildid <span className="sr-only">(current)</span>
                    </a>
                  </li>
                  <li className="nav-item">
                    <a className="nav-link" href="#">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        className="feather feather-home"
                      >
                        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                        <polyline points="9 22 9 12 15 12 15 22" />
                      </svg>
                      Video <span className="sr-only">(current)</span>
                    </a>
                  </li>
                  <li className="nav-item">
                    <a className="nav-link" href="#">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        className="feather feather-file"
                      >
                        <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" />
                        <polyline points="13 2 13 9 20 9" />
                      </svg>
                      Waze
                    </a>
                  </li>
                  <li className="nav-item">
                    <a className="nav-link" href="#">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        className="feather feather-shopping-cart"
                      >
                        <circle cx="9" cy="21" r="1" />
                        <circle cx="20" cy="21" r="1" />
                        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                      </svg>
                      Twitter
                    </a>
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

                <section>
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
                    <section>
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
