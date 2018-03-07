import React, { Component } from 'react';
import PropTypes from 'prop-types';

import CuisineTypeListRow from './CuisineTypeListRow';

const styles = {
  btn: {
    marginBottom: 0,
  },
};

class CuisineTypeList extends Component {
  constructor(props) {
    super(props);

    this.createCuisineType = this.createCuisineType.bind(this);
  }

  createCuisineType(e) {
    this.props.createCuisineType(e, this.createNewInput.value.trim());
    this.createNewInput.value = '';
  }

  render() {
    const { cuisineTypeList, activeEditor } = this.props;
    return (
      <div className="CuisineTypeList">
        <table className="table table-striped table-bordered dataTable no-footer">
          <thead>
            <tr>
              <th>Id</th>
              <th>Name</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {cuisineTypeList.map(cuisineType => (
              <CuisineTypeListRow
                key={cuisineType.id}
                id={cuisineType.id}
                name={cuisineType.name}
                isEditing={activeEditor === cuisineType.id}
                editCuisineType={this.props.editCuisineType}
                updateCuisineType={this.props.updateCuisineType}
                deleteCuisineType={this.props.deleteCuisineType}
                cancelEditCuisineType={this.props.cancelEditCuisineType}
              />
            ))}
            <tr>
              <td />
              <td>
                <input
                  className="form-control"
                  id="createCuisineTypeInput"
                  placeholder="New cuisine type"
                  ref={(input) => { this.createNewInput = input; }}
                />
              </td>
              <td>
                <button
                  className="btn btn-primary-alt"
                  style={styles.btn}
                  onClick={e => this.createCuisineType(e)}
                >Create</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }
}
CuisineTypeList.propTypes = {
  cuisineTypeList: PropTypes.arrayOf(PropTypes.object).isRequired,
  keyword: PropTypes.string,
  activeEditor: PropTypes.number,
  editCuisineType: PropTypes.func.isRequired,
  updateCuisineType: PropTypes.func.isRequired,
  deleteCuisineType: PropTypes.func.isRequired,
  cancelEditCuisineType: PropTypes.func.isRequired,
  createCuisineType: PropTypes.func.isRequired,
};
CuisineTypeList.defaultProps = {
  keyword: '',
  activeEditor: -1,
};

export default CuisineTypeList;
