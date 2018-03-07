import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import RestaurantApiConnectors from '../../api-connectors/RestaurantApiConnectors';
import CuisineTypeApiConnectors from '../../api-connectors/CuisineTypeApiConnectors';
import PhotoApiConnectors from '../../api-connectors/PhotoApiConnectors';
import CardApiConnectors from '../../api-connectors/CardApiConnectors';
import DefaultContainerLayout from '../shared/layouts/DefaultContainerLayout';
import RestaurantEditor from './RestaurantEditor';

const styles = {
  backBtn: {
    marginRight: 10,
  },
};

class RestaurantDetailContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      restaurantEditorData: {},
      isEditorChanged: false, // users will have to modify data before they can submit
      restaurantCards: [],
    };
    
    this.updateRestaurant = this.updateRestaurant.bind(this);
    this.onUploadPhoto = this.onUploadPhoto.bind(this);
    this.getRestaurantCards = this.getRestaurantCards.bind(this);
  }

  componentDidMount() {
    const { id, actions } = this.props;
    const { card, restaurant } = this.props.reducers;
    
    // load data
    actions.getRestaurantDetailRequest();
    RestaurantApiConnectors.getRestaurantDetail(id).then((data) => {
      actions.getRestaurantDetailSuccess(data);
    }).catch((err) => {
      actions.getRestaurantDetailFailure(err);
    });
    
    // get all cuisine types for the drop down select
    actions.getCuisineTypeListRequest();
    CuisineTypeApiConnectors.getCuisineTypeList().then((data) => {
      actions.getCuisineTypeListSuccess(data);
    }).catch((err) => {
      actions.getCuisineTypeListFailure(err);
    });
    
    if (card.cardList.length === 0) {
      actions.getCardListRequest();
      CardApiConnectors.getCardList().then((data) => {
        actions.getCardListSuccess(data);
        this.getRestaurantCards();
      }).catch((err) => {
        actions.getCardListFailure(err);
      });
    } else {
      this.getRestaurantCards();
    }
  
    if (restaurant.restaurantList.length === 0) {
      actions.getRestaurantListRequest();
      RestaurantApiConnectors.getRestaurantList().then((data) => {
        actions.getRestaurantListSuccess(data);
      }).catch((err) => {
        actions.getRestaurantListFailure(err);
      });
    }
  }
  
  onUploadPhoto(uploadPhoto) {
    const { id, actions } = this.props;
    actions.updateRestaurantRequest();
    uploadPhoto.uploadWrapper(PhotoApiConnectors.uploadPhoto).then(() => {
      PhotoApiConnectors.createPhotoModel({
        url: `/storage/photos/download/${uploadPhoto.state.uuidName}`,
        restaurantId: this.props.id,
        cardId: null,
      }).then((data) => {
        const newPhotos =
          this.props.reducers.restaurant.restaurantDetails[this.props.id].photos.slice();
        newPhotos.push(data);
        const newRestaurantData = {
          ...this.props.reducers.restaurant.restaurantDetails[id],
          photos: newPhotos,
        };
        uploadPhoto.cleanInput();
        actions.updateRestaurantSuccess(newRestaurantData);
        actions.updateRestaurantListSuccess(newRestaurantData);
        actions.createSuccessAlert('Upload Success!');
      }).catch((err) => {
        actions.updateRestaurantFailure(err);
        actions.createDangerAlert(err.message || 'Upload failed.');
      });
    });
  }
  
  onDeletePhoto(photoUrl) {
    const { id, actions } = this.props;
    actions.updateRestaurantRequest();
    const newPhotos =
      this.props.reducers.restaurant.restaurantDetails[this.props.id].photos.slice();
    PhotoApiConnectors.updatePhotoModel({
      url: photoUrl,
      restaurantId: null,
      cardId: null,
    }).then((data) => {
      newPhotos.splice(_.findIndex(newPhotos, { url: data.url }), 1);
      const newRestaurantData = {
        ...this.props.reducers.restaurant.restaurantDetails[id],
        photos: newPhotos,
      };
      actions.updateRestaurantSuccess(newRestaurantData);
      actions.updateRestaurantListSuccess(newRestaurantData);
      actions.createSuccessAlert('Delete Success!');
    }).catch((err) => {
      actions.updateRestaurantFailure(err);
      actions.createDangerAlert(err.message || 'Delete failed.');
    });
  }
  
  getRestaurantCards() {
    const { id } = this.props;
    const { cardList } = this.props.reducers.card;
    const restaurantCards = cardList.filter(card => (
      Number(card.restaurantId) === Number(id)
    ));
    this.setState({ restaurantCards });
  }
  
  updateRestaurant() {
    const { id, actions } = this.props;
    const { restaurantEditorData } = this.state;

    actions.updateRestaurantRequest();
    RestaurantApiConnectors.updateRestaurantDetail(id, restaurantEditorData).then((rawResponse) => {
      actions.updateRestaurantSuccess(rawResponse);
      actions.updateRestaurantListSuccess(rawResponse);
      actions.createSuccessAlert('Update Success!');
      this.setState({ isEditorChanged: false });
    }).catch((err) => {
      actions.updateRestaurantFailure(err);
      actions.createDangerAlert(err.message || 'Update failed.');
    });
  }
  
  render() {
    const restaurant = this.props.reducers.restaurant.restaurantDetails[this.props.id];
    const { isRequestingDetail, isUpdating } = this.props.reducers.restaurant;
    const { cuisineTypeList } = this.props.reducers.cuisineType;
    const { isEditorChanged } = this.state;
    return (
      <div className="RestaurantDetailContainer">
        <DefaultContainerLayout {...this.props}>
          <div className="container-fluid">
            <h1>Restaurant Details</h1>
            <div className="panel panel-bluegraylight">
              <div className="panel-heading">
                <h2>Restaurant Editor</h2>
              </div>
              <div className="panel-body">
                {isRequestingDetail ? (<div>Loading...</div>) : (
                  <RestaurantEditor
                    photoUploaderId="restaurantDetailPhotoUploader"
                    onUploadPhoto={(uploadPhoto) => {
                      this.onUploadPhoto(uploadPhoto);
                    }}
                    onDeletePhoto={(photoUrl) => {
                      this.onDeletePhoto(photoUrl);
                    }}
                    restaurant={restaurant}
                    cuisineTypes={cuisineTypeList}
                    onChange={(resData) => {
                      if (!this.state.isEditorChanged) {
                        this.setState({ isEditorChanged: true });
                      }
                      this.setState({ restaurantEditorData: resData });
                    }}
                    restaurantCards={this.state.restaurantCards}
                  />
                )}
              </div>
              <div className="panel-footer">
                <button
                  className="btn btn-primary pull-right"
                  onClick={this.updateRestaurant}
                  disabled={!isUpdating && !isEditorChanged}
                >
                  Submit
                </button>
                <a
                  href="/#restaurants"
                  className="btn btn-default pull-right"
                  style={styles.backBtn}
                >
                  Back
                </a>
              </div>
            </div>
          </div>
        </DefaultContainerLayout>
      </div>
    );
  }
}


RestaurantDetailContainer.propType = {
  id: PropTypes.number.isRequired,
};

RestaurantDetailContainer.defaultProps = {};

export default RestaurantDetailContainer;
