import React, { Component } from 'react';
import PropTypes from 'prop-types';

const pageSizes = [1, 5, 10, 25, 50, 100];

class PageSizeSelect extends Component {
  render() {
    const { defaultPageSize, onChange } = this.props;

    return (
      <div className="PageSizeSelect dataTables_length pull-left">
        <label className="panel-ctrls-center" htmlFor="pageSizeSelect">
          <select
            name="pageSizeSelect"
            className="form-control"
            defaultValue={defaultPageSize}
            onChange={(e) => { onChange.call(this, parseInt(e.target.value, 10)); }}
          >
            {
              pageSizes.map(pageSize => (
                <option key={pageSize} value={pageSize}>{pageSize}</option>
              ))
            }
          </select>
        </label>
      </div>
    );
  }
}
PageSizeSelect.propTypes = {
  onChange: PropTypes.func,
  defaultPageSize: PropTypes.oneOf(pageSizes),
};
PageSizeSelect.defaultProps = {
  onChange: (pageSize) => {},  // eslint-disable-line
  defaultPageSize: 10,
};

export default PageSizeSelect;
