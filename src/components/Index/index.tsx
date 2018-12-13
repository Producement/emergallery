import React from 'react';
import sos from './sos.png';
import { Link } from 'react-router-dom';

class Index extends React.Component<any, any> {
  render() {
    return (
      <Link to="/event/S7FXwA766Nay1ymu0dcN">
        <img src={sos} />
      </Link>
    );
  }
}

export default Index;
