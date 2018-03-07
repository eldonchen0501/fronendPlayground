import _ from 'lodash';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import config from '../../app/config';
import { CARD_STATUS } from '../../constants/CardConstants';

const styles = {
  img: {
    width: 120,
    height: 120,
  },
  btn: {
    marginRight: 10,
  },
};

class ReportList extends Component {
  parsePhotoUrl(card) {
    const photo = _.first(card.photos);
    return `${config.apiUrl}/${photo.url}`;
  }

  parsePhotoName(card) {
    const photo = _.first(card.photos);
    const index = photo.url.lastIndexOf('/');
    return photo.url.substring(index + 1);
  }

  render() {
    const { reportList } = this.props;

    return (
      <div className="ReportList">
        <table className="table table-striped table-bordered dataTable no-footer">
          <thead>
            <tr>
              <th>ID</th>
              <th>Description</th>
              <th>Card Id</th>
              <th>Card</th>
              <th>Card Status</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {reportList.map((report) => {
              const { cardList } = this.props;
              const cardId = report.cardId;
              const card = _.find(cardList, { id: cardId });

              const reportRow = (
                <tr key={report.id}>
                  <td>{report.id}</td>
                  <td>{report.description}</td>
                  <td><a href={`/#cards/${report.cardId}`}>{report.cardId}</a></td>
                  <td>
                    <img
                      className="img-responsive"
                      style={styles.img}
                      src={this.parsePhotoUrl(card)}
                      alt={this.parsePhotoName(card)}
                    />
                  </td>
                  <td>
                    <div>{card.status}</div>
                    <button
                      className="btn btn-danger"
                      style={styles.btn}
                      onClick={e => this.props.onDeleteCard(e, report.cardId)}
                      disabled={card.status === CARD_STATUS.DELETED}
                    >Delete Card</button>
                  </td>
                  <td>{report.status}</td>
                  <td>
                    <button
                      className="btn btn-warning"
                      style={styles.btn}
                      onClick={e => this.props.onDeleteReport(e, report.id)}
                    >Delete Report</button>
                  </td>
                </tr>
              );
              return reportRow;
            })}
          </tbody>
        </table>
      </div>
    );
  }
}
ReportList.ropTypes = {
  reportList: PropTypes.arrayOf(PropTypes.object),
  cardList: PropTypes.arrayOf(PropTypes.object),
  onDeleteCard: PropTypes.func,
  onDeleteReport: PropTypes.func,
};
ReportList.defaultProps = {
  reportList: [],
  cardList: [],
  onDeleteCard: () => {},
  onDeleteReport: () => {},
};

export default ReportList;
