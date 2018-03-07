import _ from 'lodash';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import OpeningHourPeriodEditor from './OpeningHourPeriodEditor';

const styles = {
  th: {
    width: '14.28%', // 1/7
  },
};
const weekDayToText = {
  0: 'Sun',
  1: 'Mon',
  2: 'Tue',
  3: 'Wed',
  4: 'Thr',
  5: 'Fri',
  6: 'Sat',
};

class OpeningHoursEditor extends Component {
  renderOpeningHourPeriodEditor(day) {
    const { openingHours, onChange } = this.props;
    return (
      <OpeningHourPeriodEditor
        periods={openingHours.periods}
        day={day.toString()}
        onChange={(updatedPeriods) => {
          const updatedOpeningHours = _.clone(openingHours);
          updatedOpeningHours.periods = updatedPeriods;
          onChange.call(null, updatedOpeningHours);
        }}
      />
    );
  }

  renderWeekDayText(periods, day) {
    const filteredPeriods = _.filter(periods, p => (p.open.day.toString() === day.toString()));
    if (JSON.stringify(filteredPeriods).includes('Invalid date')) {
      return 'N/A';
    }
    
    if (filteredPeriods.length === 0) {
      return `${weekDayToText[day]}: Closed`;
    }

    return filteredPeriods.map((p) => {
      const formattedOpenTime = moment(p.open.time, 'hhmm').format('h:mm A');
      const formattedCloseTime = moment(p.close.time, 'hhmm').format('h:mm A');
      return `${formattedOpenTime} - ${formattedCloseTime}`;
    }).join(', \n');
  }

  render() {
    const { periods } = this.props.openingHours;
    return (
      <div className="OpeningHoursEditor">
        <table className="table table-bordered">
          <thead>
            <tr>
              <th style={styles.th}>Sunday</th>
              <th style={styles.th}>Monday</th>
              <th style={styles.th}>Tuesday</th>
              <th style={styles.th}>Wednesday</th>
              <th style={styles.th}>Thursday</th>
              <th style={styles.th}>Friday</th>
              <th style={styles.th}>Saturday</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{this.renderOpeningHourPeriodEditor(0)}</td>
              <td>{this.renderOpeningHourPeriodEditor(1)}</td>
              <td>{this.renderOpeningHourPeriodEditor(2)}</td>
              <td>{this.renderOpeningHourPeriodEditor(3)}</td>
              <td>{this.renderOpeningHourPeriodEditor(4)}</td>
              <td>{this.renderOpeningHourPeriodEditor(5)}</td>
              <td>{this.renderOpeningHourPeriodEditor(6)}</td>
            </tr>
            <tr>
              <td>{this.renderWeekDayText(periods, 0)}</td>
              <td>{this.renderWeekDayText(periods, 1)}</td>
              <td>{this.renderWeekDayText(periods, 2)}</td>
              <td>{this.renderWeekDayText(periods, 3)}</td>
              <td>{this.renderWeekDayText(periods, 4)}</td>
              <td>{this.renderWeekDayText(periods, 5)}</td>
              <td>{this.renderWeekDayText(periods, 6)}</td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }
}
OpeningHoursEditor.propTypes = {
  openingHours: PropTypes.object,
  onChange: PropTypes.func,
};
OpeningHoursEditor.defaultProps = {
  openingHours: {
    periods: [],
    weekDayText: [],
  },
  onChange: (updatedOpeningHours) => {}, // eslint-disable-line
};

export default OpeningHoursEditor;
