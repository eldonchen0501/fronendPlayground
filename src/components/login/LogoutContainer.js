import React, { Component } from 'react';
import LoginApiConnectors from '../../api-connectors/LoginApiConnectors';

class LogoutContainer extends Component {
  componentDidMount() {
    const { app, actions } = this.props;

    actions.logoutRequest();
    LoginApiConnectors.logout().then(() => {
      actions.createSuccessAlert('Logout Success!');
    }).catch((err) => {
      actions.logoutFailure(err);
    }).finally(() => {
      app.logout();
      app.router.navigate('/login', { trigger: true });
    });
  }

  render() {
    return (
      <div className="LogoutContainer" />
    );
  }
}

export default LogoutContainer;
