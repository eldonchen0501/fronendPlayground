/**
 * TODO: think about making this more clear:
 * renderToMainSection(Container).mapAppToProps(this.app).mapStoreToProps(this.store);
 * renderToMainSection(Container).mapToProps({app: this.app, store: this.store});
 */
import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import RootContainer from '../components/RootContainer';

const ROOT_CONTAINER_ID = 'root';


export default function renderToMainSection(ChildContainer, app, store, childContainerProps) {
  render(
    <Provider store={store}>
      <RootContainer
        app={app}
        childContainer={ChildContainer}
        childContainerProps={childContainerProps}
      />
    </Provider>,
    document.getElementById(ROOT_CONTAINER_ID)
  );
}
