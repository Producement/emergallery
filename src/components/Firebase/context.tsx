import * as React from 'react';
import Firebase from './firebase';

const FirebaseContext = React.createContext<Firebase | null>(null);

export const withFirebase = (Component: typeof React.Component) => (
  props: any
) => (
  <FirebaseContext.Consumer>
    {firebase => <Component {...props} firebase={firebase} />}
  </FirebaseContext.Consumer>
);

export default FirebaseContext;
