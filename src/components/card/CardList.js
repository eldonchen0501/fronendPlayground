import React, { Component } from 'react';
import PropTypes from 'prop-types';
import CardListRow from './CardListRow';

class CardList extends Component {

  render() {
    return (
      <div className="CardList">
        <table className="table table-striped table-bordered dataTable no-footer">
          <thead>
            <tr>
              <th>Id</th>
              <th>Name</th>
              <th>Description</th>
              <th>Restaurant</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {this.props.cardList.map(card => (
              <CardListRow
                key={card.id}
                id={card.id}
                name={card.name}
                description={card.description}
                restaurant={card.restaurant}
                status={card.status}
                approveCard={this.props.approveCard}
                rejectCard={this.props.rejectCard}
              />
            ))}
          </tbody>
        </table>
      </div>
    );
  }
}
CardList.propTypes = {
  cardList: PropTypes.arrayOf(PropTypes.object).isRequired,
  rejectCard: PropTypes.func.isRequired,
  approveCard: PropTypes.func.isRequired,
};

export default CardList;
