import React, { Component } from 'react';
import ReactGridGallery from 'react-grid-gallery';
import { withFirebase } from '../Firebase';

class Gallery extends Component<any, any> {
  constructor(props) {
    super(props);
    this.state = { images: [] };
  }

  componentDidMount() {
    this.props.firebase
      .firestore()
      .collection('events')
      .doc(this.props.id)
      .collection('images')
      .onSnapshot((snapshot: any) => {
        const images: Array<any> = [];
        snapshot.forEach(function(doc: any) {
          images.push(doc.data());
        });
        this.setState({
          images: images
        });
      });
  }

  render() {
    return <ReactGridGallery images={this.state.images} />;
  }
}

export default withFirebase(Gallery);
