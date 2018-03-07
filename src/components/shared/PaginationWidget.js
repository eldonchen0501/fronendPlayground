import React, { Component } from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';

class PaginationWidget extends Component {
  constructor(props) {
    super(props);

    this.onClickPrev = this.onClickPrev.bind(this);
    this.onClickNext = this.onClickNext.bind(this);
  }

  onClickPrev() {
    const { activePage, onPageChange } = this.props;

    if (activePage === 1) {
      return false;
    }
    return onPageChange.call(null, activePage - 1);
  }

  onClickNext() {
    const { activePage, totalPages, onPageChange } = this.props;

    if (activePage === totalPages) {
      return false;
    }
    return onPageChange.call(null, activePage + 1);
  }

  onClickPageButton(pageNum) {
    this.props.onPageChange.call(this, pageNum);
  }

  get1stPageButtonNumber() {
    const { activePage, totalPages } = this.props;
    if (totalPages < 6 || activePage < 3) {
      return 1;
    } else if (totalPages - activePage < 3) {
      return totalPages - 4;
    }
    return activePage - 2;
  }

  get2ndPageButtonNumber() {
    const { activePage, totalPages } = this.props;
    if (totalPages < 6 || activePage < 3) {
      return 2;
    } else if (totalPages - activePage < 3) {
      return totalPages - 3;
    }
    return activePage - 1;
  }

  get3rdPageButtonNumber() {
    const { activePage, totalPages } = this.props;
    if (totalPages < 6 || activePage < 3) {
      return 3;
    } else if (totalPages - activePage < 3) {
      return totalPages - 2;
    }
    return activePage;
  }

  get4thPageButtonNumber() {
    const { activePage, totalPages } = this.props;
    if (totalPages < 6 || activePage < 3) {
      return 4;
    } else if (totalPages - activePage < 3) {
      return totalPages - 1;
    }
    return activePage + 1;
  }

  get5thPageButtonNumber() {
    const { activePage, totalPages } = this.props;
    if (totalPages < 6 || activePage < 3) {
      return 5;
    } else if (totalPages - activePage < 3) {
      return totalPages;
    }
    return activePage + 2;
  }

  render() {
    const { totalPages, activePage } = this.props;
    const p1 = this.get1stPageButtonNumber();
    const p2 = this.get2ndPageButtonNumber();
    const p3 = this.get3rdPageButtonNumber();
    const p4 = this.get4thPageButtonNumber();
    const p5 = this.get5thPageButtonNumber();

    return (
      <div className="PaginationWidget dataTables_paginate paging_bootstrap no-select">
        <ul className="pagination pull-right m-n">
          <li className={classnames('previous', { disabled: activePage === 1 })}>
            <a role="button" onClick={this.onClickPrev}>Previous</a>
          </li>
          <li className={classnames({ active: activePage === 1 })}>
            <a role="button" onClick={() => { this.onClickPageButton(p1); }}>{p1}</a>
          </li>
          {totalPages > 1 && (
            <li className={classnames({ active: activePage === 2 })}>
              <a role="button" onClick={() => { this.onClickPageButton(p2); }}>{p2}</a>
            </li>
          )}
          {totalPages > 2 && (
            <li className={classnames({ active: activePage === p3 })}>
              <a role="button" onClick={() => { this.onClickPageButton(p3); }}>{p3}</a>
            </li>
          )}
          {totalPages > 3 && (
            <li className={classnames({ active: activePage === p4 })}>
              <a role="button" onClick={() => { this.onClickPageButton(p4); }}>{p4}</a>
            </li>
          )}
          {totalPages > 4 && (
            <li className={classnames({ active: activePage === p5 })}>
              <a role="button" onClick={() => { this.onClickPageButton(p5); }}>{p5}</a>
            </li>
          )}
          <li className={classnames('next', { disabled: activePage === totalPages })}>
            <a role="button" onClick={this.onClickNext}>Next</a>
          </li>
        </ul>
      </div>
    );
  }
}
PaginationWidget.propTypes = {
  totalPages: PropTypes.number,
  activePage: PropTypes.number,
  onPageChange: PropTypes.func,
};
PaginationWidget.defaultProps = {
  totalPages: 10,
  activePage: 1,
  onPageChange: (pageNum) => {}, // eslint-disable-line
};

export default PaginationWidget;
