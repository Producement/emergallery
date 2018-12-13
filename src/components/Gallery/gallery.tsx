import React, { Component } from 'react';
import { withRouter } from 'react-router';
import ReactGallery from 'react-photo-gallery';
import { withFirebase } from '../Firebase';
import Lightbox from 'react-images';

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
      <div>
        <section>
          <h1>{this.props.title}</h1>
          <ReactGallery
            photos={this.props.photos}
            onClick={this.openLightbox}
          />
          <Lightbox
            images={this.props.photos}
            onClose={this.closeLightbox}
            onClickPrev={this.gotoPrevious}
            onClickNext={this.gotoNext}
            currentImage={this.state.currentImage}
            isOpen={this.state.lightboxIsOpen}
          />
        </section>
      </div>
    );
  }
}

class Gallery extends Component<any, any> {
  constructor(props) {
    super(props);
    this.state = { images: [], twitter: [], snapchat: [] };
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

    eventDoc.collection('twitter').onSnapshot((snapshot: any) => {
      const images: Array<any> = [];
      snapshot.forEach(function(doc: any) {
        images.push(doc.data());
      });
      this.setState({
        twitter: images
      });
    });

    eventDoc.collection('snapchat').onSnapshot((snapshot: any) => {
      const images: Array<any> = [];
      snapshot.forEach(function(doc: any) {
        images.push(doc.data());
      });
      this.setState({
        snapchat: images
      });
    });
  }

  render() {
    return (
      <div>
        <section>
          <SubGallery title="Pildid" photos={this.state.images} />
        </section>
        <section>
          <SubGallery title="Twitter" photos={this.state.twitter} />
        </section>
        <section>
          <SubGallery title="Snapchat" photos={this.state.snapchat} />
        </section>
      </div>
    );
  }
}

export default withRouter(withFirebase(Gallery));
