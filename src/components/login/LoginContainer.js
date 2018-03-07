/**
 * Login Container
 * the login form which send username and password to API
 */
import React, { Component } from 'react';
import LoginApiConnectors from '../../api-connectors/LoginApiConnectors';

const styles = {
  panel: {
    marginTop: 180,
  },

};

class LoginContainer extends Component {
  constructor(props) {
    super(props);

    this.onClickLogin = this.onClickLogin.bind(this);
  }

  onClickLogin() {
    const { actions, app } = this.props;

    actions.loginRequest();
    LoginApiConnectors.login(this.emailInput.value, this.passwordInput.value).then((rawData) => {
      actions.loginSuccess(rawData);
      actions.createSuccessAlert('Login Success!');
      app.login(rawData.id, rawData.ttl, rawData.created, rawData.userId);
      app.router.navigate('/', { trigger: true });
    }).catch((err) => {
      actions.createDangerAlert('Login failed, please double check your email and password.');
      actions.loginFailure(err);
    });
  }

  render() {
    return (
      <div className="LoginContainer">
        <div className="container">
          <div className="row">
            <div className="col-md-4 col-md-offset-4">
              <div className="panel panel-default" style={styles.panel}>
                <div className="panel-heading">
                  <h2>Login Form</h2>
                </div>
                <div className="panel-body">
                  <form className="form-horizontal">
                    <div className="form-group mb-md">
                      <div className="col-xs-12">
                        <div className="input-group">
                          <span className="input-group-addon"><i className="ti ti-user" /></span>
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Username"
                            ref={(input) => { this.emailInput = input; }}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="form-group mb-md">
                      <div className="col-xs-12">
                        <div className="input-group">
                          <span className="input-group-addon"><i className="ti ti-key" /></span>
                          <input
                            type="password"
                            className="form-control"
                            placeholder="Password"
                            ref={(input) => { this.passwordInput = input; }}
                          />
                        </div>
                      </div>
                    </div>
                  </form>
                </div>
                <div className="panel-footer">
                  <div className="clearfix">
                    <button
                      className="btn btn-primary pull-right"
                      type="submit"
                      onClick={this.onClickLogin}
                    >
                      Login
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default LoginContainer;
