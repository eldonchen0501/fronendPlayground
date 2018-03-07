import React, { Component } from 'react';
import PropTypes from 'prop-types';
import config from '../../app/config';

class CardsViewer extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  
  renderCardRow(cards) {
    const returnCardRowArr = cards.map(card => (
      <div className="col-md-3" key={card.id}>
        <a href={`/#cards/${card.id}`}>
          <img
            src={config.apiUrl + card.photos[0].url}
            className="img-responsive"
            alt=" "
          />
        </a>
      </div>
    ));
    return returnCardRowArr;
  }
  
  renderCards() {
    const returnCardArr = [];
    const { restaurantCards } = this.props;
    restaurantCards.forEach((card, index) => {
      if (index % 4 === 0) {
        returnCardArr.push(
          <div
            className="row" style={{ margin: '15px 0px 15px 0px' }}
            key={`row${card.id}`}
          >
            {this.renderCardRow(restaurantCards.slice(index, index + 4))}
          </div>
        );
      }
    });
    return returnCardArr;
  }
  
  render() {
    return (
      <div className="CardsViewer">
        <div className="container-fluid">
          {this.renderCards()}
        </div>
      </div>
    );
  }
}

CardsViewer.PropTypes = {
  restaurantCards: PropTypes.arrayOf(PropTypes.object).isRequired,
};

CardsViewer.defaultProps = {};

export default CardsViewer;
