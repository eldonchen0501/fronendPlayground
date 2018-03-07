import React, { Component } from 'react';
import PropTypes from 'prop-types';

const styles = {
  btnGroup: {
    listStyle: 'none',
    display: 'inline-flex',
    marginBottom: 0,
  },
};

class CuisineTypeListRow extends Component {

  render() {
    const { id, name, isEditing } = this.props;

    let editButton = null;
    let deleteButton = null;
    let updateButton = null;
    let CancelButton = null;
    let cuisineTypeNameHtml = null;

    if (isEditing) {
      updateButton = (
        <li>
          <button
            className="btn btn-success"
            onClick={e => this.props.updateCuisineType(e, id, this.nameInput.value.trim())}
          >Update</button>
        </li>
      );
      CancelButton = (
        <li>
          <button
            className="btn btn-warning"
            onClick={e => this.props.cancelEditCuisineType(e)}
          >Cancel</button>
        </li>
      );
      cuisineTypeNameHtml = (
        <input
          id="editCuisineTypeName"
          type="text"
          className="form-control"
          ref={(input) => { this.nameInput = input; }}
          defaultValue={name}
        />
      );
    } else {
      editButton = (
        <li>
          <button
            className="btn btn-primary"
            onClick={e => this.props.editCuisineType(e, id)}
          >Edit</button>
        </li>
      );
      deleteButton = (
        <li>
          <button
            className="btn btn-danger"
            onClick={e => this.props.deleteCuisineType(e, id)}
          >Delete</button>
        </li>
      );
      cuisineTypeNameHtml = (name);
    }

    return (
      <tr key={id}>
        <td>{id}</td>
        <td>{cuisineTypeNameHtml}</td>
        <td>
          <ul
            className="list-inline"
            style={styles.btnGroup}
          >
            {editButton}
            {updateButton}
            {deleteButton}
            {CancelButton}
          </ul>
        </td>
      </tr>
    );
  }
}
CuisineTypeListRow.propTypes = {
  id: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
  isEditing: PropTypes.bool,
  editCuisineType: PropTypes.func.isRequired,
  updateCuisineType: PropTypes.func.isRequired,
  deleteCuisineType: PropTypes.func.isRequired,
  cancelEditCuisineType: PropTypes.func.isRequired,
};
CuisineTypeListRow.defaultProps = {
  isEditing: false,
};

export default CuisineTypeListRow;
