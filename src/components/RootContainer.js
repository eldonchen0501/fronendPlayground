/**
 * RootContainer as a layer for binding with actions and redux store.
 * The hierarchy looks like this:
 *    app/index.js
 *      -> Router
 *      -> (route matched, trigger renderToMainSection)
 *      -> RootContainer (where redux meets react)
 *      -> Containers (with store data attached to props)
 *      -> Child Components
 */
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import AlertContainer from './alert/AlertContainer';

// action creators
import AlertActionCreators from '../actions/AlertActionCreators';
import CardActionCreators from '../actions/CardActionCreators';
import CuisineTypeActionCreators from '../actions/CuisineTypeActionCreators';
import LoginActionCreators from '../actions/LoginActionCreators';
import RestaurantActionCreators from '../actions/RestaurantActionCreators';
import ReportActionCreators from '../actions/ReportActionCreators';

class RootContainer extends Component {
  render() {
    const ChildContainer = this.props.childContainer;
    const rootContainerProps = this.props;
    const childContainerProps = {
      ...rootContainerProps,
      ...rootContainerProps.childContainerProps,
    };

    // clean up unwanted props inherited from root container
    delete childContainerProps.childContainer;
    delete childContainerProps.childContainerProps;

    return (
      <div className="RootContainer">
        <div className="container-fluid">
          <div className="row">
            <AlertContainer {...this.props} />
            <ChildContainer {...childContainerProps} />
          </div>
        </div>
      </div>
    );
  }
}

RootContainer.propTypes = {
  childContainer: React.PropTypes.func.isRequired,
  childContainerProps: React.PropTypes.object,
};

RootContainer.defaultProps = {
  childContainer: () => ((<div>Root Container</div>)),
  childContainerProps: {},
};

/**
 * Mixin RootContainer with Redux methods
 * and export an "enhanced" RootContainer class
 */

// the state here means the state of the entire application (store state)
// store states will be mapped to RootContainer's this.props.{REDUCER_NAME}
// for example, data controlled by user reducer will be available at this.props.user
function mapStoreStateToProps(state) {
  return {
    reducers: state,
  };
}

function mapDispatchToProps(dispatch) {
// mixin all action creators to `this.props.actions`
// so that in the RootContainer we can call this.props.actions.{ACTION_CREATOR_NAME}
// to trigger an action or pass actions down to children components
  const allActions = {
    ...AlertActionCreators,
    ...CardActionCreators,
    ...CuisineTypeActionCreators,
    ...LoginActionCreators,
    ...RestaurantActionCreators,
    ...ReportActionCreators,
  };
  return {
    actions: bindActionCreators(allActions, dispatch),
  };
}

export default connect(
    mapStoreStateToProps,
    mapDispatchToProps
)(RootContainer);
