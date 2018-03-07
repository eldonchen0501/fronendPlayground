import React, { Component } from 'react';
import PropTypes from 'prop-types';

class PaginationStatus extends Component {
  render() {
    const { totalCount, startPosition, endPosition } = this.props;
    return (
      <div className="PaginationStatus">
        <div className="PaginationStatus dataTables_info" role="status">
          Showing {startPosition} to {endPosition} of {totalCount} entries
        </div>
      </div>
    );
  }
}

PaginationStatus.propTypes = {
  totalCount: PropTypes.number,
  startPosition: PropTypes.number,
  endPosition: PropTypes.number,
};

PaginationStatus.defaultProps = {
  totalCount: 0,
  startPosition: 0,
  endPosition: 0,
};

export default PaginationStatus;
