import React, { Component } from 'react';
import _ from 'lodash';

import RestaurantApiConnectors from '../../api-connectors/RestaurantApiConnectors';
import CuisineTypeApiConnectors from '../../api-connectors/CuisineTypeApiConnectors';
import DefaultContainerLayout from '../shared/layouts/DefaultContainerLayout';
import RestaurantEditor from './RestaurantEditor';
import PhotoApiConnectors from '../../api-connectors/PhotoApiConnectors';

const styles = {
  backBtn: {
    marginRight: 10,
  },
};

class RestaurantCreateContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      restaurantEditorData: {
        photos: [],
      },
      isEditorChanged: false,
    };
    this.createRestaurant = this.createRestaurant.bind(this);
    this.onUploadPhoto = this.onUploadPhoto.bind(this);
    this.onDeletePhoto = this.onDeletePhoto.bind(this);
  }
  componentDidMount() {
    const { actions } = this.props;
    actions.getCuisineTypeListRequest();
    CuisineTypeApiConnectors.getCuisineTypeList().then((data) => {
      actions.getCuisineTypeListSuccess(data);
    }).catch((err) => {
      actions.getCuisineTypeListFailure(err);
    });
  }
  
  onUploadPhoto(uploadPhoto) {
    const { id } = this.props;
    uploadPhoto.uploadWrapper(PhotoApiConnectors.uploadPhoto).then(() => {
      const newPhotos = this.state.restaurantEditorData.photos.slice();
      newPhotos.push({
        url: `/storage/photos/download/${uploadPhoto.state.uuidName}`,
        restaurantId: id,
        cardId: null,
      });
      uploadPhoto.cleanInput();
      this.setState({
        restaurantEditorData: {
          ...this.state.restaurantEditorData,
          photos: newPhotos,
        },
      });
    });
  }
  
  onDeletePhoto(photoUrl) {
    const newPhotos = this.state.restaurantEditorData.photos.slice();
    newPhotos.splice(_.findIndex(newPhotos, { url: photoUrl }), 1);
    this.setState({
      restaurantEditorData: {
        photos: newPhotos,
      },
    });
  }
  
  createRestaurant() {
    const { actions } = this.props;
    const { restaurantEditorData } = this.state;
    actions.createRestaurantRequest();
    RestaurantApiConnectors.createRestaurant(restaurantEditorData).then((data) => {
      this.state.restaurantEditorData.photos.forEach((photo) => {
        PhotoApiConnectors.createPhotoModel({
          url: photo.url,
          restaurantId: data.id,
          cardId: null,
        });
      });
      actions.createRestaurantSuccess(data);
      actions.createSuccessAlert('Create Success!');
      this.props.app.router.navigate('/restaurants', { trigger: true });
    }).catch((err) => {
      actions.createRestaurantFailure(err);
    });
  }
  
  render() {
    const { cuisineTypeList } = this.props.reducers.cuisineType;
    const { isCreating } = this.props.reducers.restaurant;
    const { isEditorChanged } = this.state;
    return (
      <div className="RestaurantCreateContainer">
        <DefaultContainerLayout {...this.props}>
          <div className="container-fluid">
            <h1>Create a new restaurant</h1>
            <div className="panel panel-bluegraylight">
              <div className="panel-heading">
                <h2>Restaurant Creator</h2>
              </div>
              <div className="panel-body">
                <RestaurantEditor
                  photoUploaderId="restaurantCreatePhotoUploader"
                  restaurant={this.state.restaurantEditorData}
                  cuisineTypes={cuisineTypeList}
                  onUploadPhoto={(uploadPhoto) => {
                    this.onUploadPhoto(uploadPhoto);
                  }}
                  onDeletePhoto={(photoUrl) => {
                    this.onDeletePhoto(photoUrl);
                  }}
                  onChange={(resData) => {
                    if (!this.state.isEditorChanged) {
                      this.setState({ isEditorChanged: true });
                    }
                    this.setState({
                      restaurantEditorData: {
                        ...this.state.restaurantEditorData,
                        ...resData,
                      },
                    });
                  }}
                  restaurantCards={[]}
                />
              </div>
              <div className="panel-footer">
                <button
                  className="btn btn-primary pull-right"
                  onClick={() => { this.createRestaurant(); }}
                  disabled={!isEditorChanged && !isCreating}
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

RestaurantCreateContainer.propType = {};

RestaurantCreateContainer.defaultProps = {};

export default RestaurantCreateContainer;
