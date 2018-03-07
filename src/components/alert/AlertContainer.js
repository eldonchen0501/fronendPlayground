import React from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

const styles = {
  container: {
    position: 'fixed',
    top: 0,
    zIndex: 1000000,
    width: '100%',
  },
  alert: {
    cursor: 'pointer',
  },
  alertTitle: {
    marginRight: 15,
  },
  closeButton: {
    position: 'relative',
    top: 2,
  },
};

class AlertContainer extends React.Component {
  onClickClose(id) {
    this.props.actions.dismissAlert(id);
  }

  renderAlertItems() {
    const alerts = this.props.reducers.alert.activeAlerts;
    
    return alerts.map((alert) => {
      if (alert.disappearAfter && alert.disappearAfter !== Infinity) {
        setTimeout(() => {
          this.props.actions.dismissAlert(alert.id);
        }, alert.disappearAfter);
      }

      return (
        <div
          key={alert.id}
          style={styles.alert}
          className={`alert alert-${alert.alertType} alert-dismissable`}
          onClick={() => this.onClickClose(alert.id)}
        >
          <button className="close" type="button">×</button>
          <span>{alert.message}</span>
        </div>
      );
    });
  }

  render() {
    return (
      <div className="AlertContainer" style={styles.container}>
        <ReactCSSTransitionGroup
          transitionName="example"
          transitionEnterTimeout={300}
          transitionLeaveTimeout={200}
        >
          {this.renderAlertItems()}
        </ReactCSSTransitionGroup>
      </div>
    );
  }
}

export default AlertContainer;
