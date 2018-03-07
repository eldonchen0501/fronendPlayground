import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { CARD_STATUS } from '../../constants/CardConstants';

const styles = {
  btnGroup: {
    listStyle: 'none',
    display: 'inline-flex',
    marginBottom: 0,
  },
};

class CardListRow extends Component {

  render() {
    const { id, name, description, restaurant, status } = this.props;

    let approveButton = null;
    let rejectButton = null;
    if (status === CARD_STATUS.PENDING) {
      approveButton = (
        <button
          className="btn btn-success"
          onClick={e => this.props.approveCard(e, id)}
        >Approve</button>
      );
      rejectButton = (
        <button
          className="btn btn-danger"
          onClick={e => this.props.rejectCard(e, id)}
        >Reject</button>
      );
    }

    return (
      <tr key={id}>
        <td><a href={`/#cards/${id}`}>{id}</a></td>
        <td>{name}</td>
        <td>{description}</td>
        <td><a href={`/#restaurants/${restaurant.id}`}>{restaurant.name}</a></td>
        <td>{status}</td>
        <td>
          <ul
            className="list-inline"
            style={styles.btnGroup}
          >
            <li>{approveButton}</li>
            <li>{rejectButton}</li>
          </ul>
        </td>
      </tr>
    );
  }
}
CardListRow.propTypes = {
  id: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
  description: PropTypes.string,
  restaurant: PropTypes.object,
  status: PropTypes.string,
  approveCard: PropTypes.func.isRequired,
  rejectCard: PropTypes.func.isRequired,
};
CardListRow.defaultProps = {
  description: '',
  restaurant: {},
  status: '',
};

export default CardListRow;
