import _ from 'lodash';
import React, { Component } from 'react';
import PropTypes from 'prop-types';

const mapPriceToDollarSign = {
  1: '$',
  2: '$$',
  3: '$$$',
  4: '$$$$',
};

class RestaurantList extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  onClickDelete(id) {
    if (window.confirm(`Are you sure to delete restaurant ${id}?`)) {
      this.props.deleteRestaurant.call(null, id);
    }
  }

  render() {
    const { restaurantList } = this.props;

    return (
      <div className="RestaurantList">
        <table className="table table-striped table-bordered dataTable no-footer">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Rating</th>
              <th>Restaurant photos</th>
              <th>Price</th>
              <th>Neighborhood</th>
              <th>City</th>
              <th>State</th>
              <th>Cuisine Types</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {restaurantList.map(res => (
              <tr key={res.id}>
                <td><a href={`/#restaurants/${res.id}`}>{res.id}</a></td>
                <td>{res.name}</td>
                <td>{res.rating}</td>
                <td>{res.photos.length}</td>
                <td>{mapPriceToDollarSign[res.price]}</td>
                <td>{res.neighborhood}</td>
                <td>{res.city}</td>
                <td>{res.state}</td>
                <td>{_.map(res.cuisineTypes, 'name').join(', ')}</td>
                <td>
                  <a href={`/#restaurants/${res.id}`} className="btn btn-primary">Edit</a>
                  <button
                    className="btn btn-danger"
                    style={{ marginLeft: 14 }}
                    onClick={() => { this.onClickDelete(res.id); }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
}

RestaurantList.propTypes = {
  keyword: PropTypes.string,
  restaurantList: PropTypes.arrayOf(PropTypes.object),
  deleteRestaurant: PropTypes.func,
};

RestaurantList.defaultProps = {
  keyword: '',
  restaurantList: [],
  deleteRestaurant: () => {},
};

export default RestaurantList;
