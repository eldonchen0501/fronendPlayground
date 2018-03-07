import _ from 'lodash';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

const styles = {
  separator: {
    lineHeight: '32px',
    textAlign: 'center',
  },
  addBtn: {
    marginTop: 10,
  },
  deleteBtn: {
    float: 'right',
    marginTop: 10,
    marginRight: 5,
    cursor: 'pointer',
  },
  periodText: {
    lineHeight: '32px',
    textAlign: 'center',
    backgroundColor: '#b2ebf2',
    borderRadius: 4,
    marginTop: 10,
  },
};

class OpeningHourPeriodEditor extends Component {
  constructor(props) {
    super(props);

    this.state = {
      openTime: '',
      closeTime: '',
    };

    this.onClickAdd = this.onClickAdd.bind(this);
    this.onChangeOpenTime = this.onChangeOpenTime.bind(this);
    this.onChangeCloseTime = this.onChangeCloseTime.bind(this);
  }

  onClickAdd() {
    const { openTime, closeTime } = this.state;

    // TODO: implement more detailed validation later
    if (parseInt(closeTime, 10) < parseInt(openTime, 10) || openTime === '' || closeTime === '') {
      return false;
    }

    const { day, periods, onChange } = this.props;
    const period = {
      open: {
        day,
        time: openTime,
      },
      close: {
        day,
        time: closeTime,
      },
    };
    const nextPeriods = periods.slice(); // make a clone

    nextPeriods.push(period);
    // clean up inputs
    this.setState({
      openTime: '',
      closeTime: '',
    });

    return onChange.call(null, nextPeriods);
  }

  onClickDelete(periodToDelete) {
    const { periods, onChange } = this.props;
    const nextPeriods = periods.slice(); // make a clone
    nextPeriods.splice(nextPeriods.indexOf(periodToDelete), 1);
    onChange.call(null, nextPeriods);
  }

  onChangeOpenTime() {
    const timeStr = this.openTimeInput.value.trim();

    if (this.isTimeStringValid(timeStr)) {
      this.setState({ openTime: this.openTimeInput.value });
    }
  }

  onChangeCloseTime() {
    const timeStr = this.closeTimeInput.value.trim();

    if (this.isTimeStringValid(timeStr)) {
      this.setState({ closeTime: this.closeTimeInput.value });
    }
  }

  isTimeStringValid(timeStr) {
    if (timeStr === '') {
      return true;
    }
    const timeNum = parseInt(timeStr, 10); // 0 ~ 2400
    return !isNaN(timeStr) && timeNum >= 0 && timeNum <= 2400;
  }

  render() {
    const { day, periods } = this.props;
    let filteredPeriods = _.filter(periods, p => p.open.day.toString() === day.toString());
    let isDateInvalid = false;
    if (JSON.stringify(filteredPeriods).includes('Invalid date')) {
      filteredPeriods = [];
      isDateInvalid = true;
    }
    
    return (
      <div className="OpeningHourPeriodEditor">
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-5 no-padding">
              <input
                type="text"
                className="form-control"
                placeholder="open"
                maxLength="4"
                value={this.state.openTime}
                onChange={this.onChangeOpenTime}
                ref={(input) => { this.openTimeInput = input; }}
              />
            </div>
            <div className="col-md-2 no-padding" style={styles.separator}>-</div>
            <div className="col-md-5 no-padding">
              <input
                type="text"
                className="form-control"
                placeholder="close"
                maxLength="4"
                value={this.state.closeTime}
                onChange={this.onChangeCloseTime}
                ref={(input) => { this.closeTimeInput = input; }}
              />
            </div>
          </div>
        </div>
        <button
          type="button"
          className="btn btn-default-alt btn-sm btn-block"
          style={styles.addBtn}
          onClick={this.onClickAdd}
          disabled={isDateInvalid}
        >
          <i className="fa fa-plus" />
        </button>
        {
          filteredPeriods.map(p => (
            <div style={styles.periodText} key={JSON.stringify(p)}>
              {moment(p.open.time, 'HHmm').format('h:mm A')}
              {' '}-{' '}
              {moment(p.close.time, 'HHmm').format('h:mm A')}
              <i
                className="fa fa-trash"
                style={styles.deleteBtn}
                role="button"
                onClick={() => { this.onClickDelete(p); }}
              />
            </div>
          ))
        }
      </div>
    );
  }
}
OpeningHourPeriodEditor.propTypes = {
  day: PropTypes.string.isRequired,
  periods: PropTypes.arrayOf(PropTypes.object),
  onChange: PropTypes.func,
};
OpeningHourPeriodEditor.defaultProps = {
  day: '0', // sunday
  periods: [],
  onChange: (updatedPeriods) => {}, // eslint-disable-line
};

export default OpeningHourPeriodEditor;
