import _ from 'lodash';
import React, { Component } from 'react';
import CardForm from './CardForm';
import { CARD_STATUS } from '../../constants/CardConstants';
import CardApiConnectors from '../../api-connectors/CardApiConnectors';
import PhotoApiConnectors from '../../api-connectors/PhotoApiConnectors';
import DefaultContainerLayout from '../shared/layouts/DefaultContainerLayout';
import RestaurantApiConnectors from '../../api-connectors/RestaurantApiConnectors';

const styles = {
  backBtn: {
    marginRight: 10,
  },
};

class CardCreateContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cardData: {
        status: CARD_STATUS.PENDING,
      },
      cardHasChanged: false,
    };

    this.createCard = this.createCard.bind(this);
    this.onUploadPhoto = this.onUploadPhoto.bind(this);
  }

  componentDidMount() {
    const { actions } = this.props;
    const { restaurantList } = this.props.reducers.restaurant;

    if (restaurantList.length === 0) {
      actions.getRestaurantListRequest();
      RestaurantApiConnectors.getRestaurantList().then((data) => {
        actions.getRestaurantListSuccess(data);
      }).catch((err) => {
        actions.getRestaurantListFailure(err);
      });
    }
  }

  onUploadPhoto(uploadPhoto) {
    const { actions } = this.props;
    const { cardData } = this.state;
    actions.updateRestaurantRequest();
    uploadPhoto.uploadWrapper(PhotoApiConnectors.uploadPhoto).then(() => {
      PhotoApiConnectors.createPhotoModel({
        url: `/storage/photos/download/${uploadPhoto.state.uuidName}`,
        restaurantId: null,
        cardId: null,
      }).then((data) => {
        uploadPhoto.cleanInput();
        const newCardData = cardData;
        const photos = new Array(data);
        _.assign(newCardData, { photos });
        actions.createSuccessAlert('Upload Success!');
        this.setState({
          cardData: newCardData,
          cardHasChanged: true,
        });
      }).catch((err) => {
        actions.createDangerAlert(err.message || 'Upload failed.');
      });
    });
  }

  getRestaurantOptions() {
    const { restaurantList } = this.props.reducers.restaurant;
    return _.map(restaurantList, res => ({ value: res.id, label: res.name }));
  }

  createCard() {
    const { actions, app } = this.props;
    const { cardData } = this.state;

    if (_.head(cardData.photos).url === undefined) {
      actions.createDangerAlert('Please upload a photo.');
      return;
    }
    actions.creaFCardteCardRequest();
    CardApiConnectors.createCard(cardData).then((newCard) => {
      actions.createCardSuccess(newCard);
      const photo = _.head(cardData.photos) || [];
      photo.cardId = newCard.id;
      PhotoApiConnectors.updatePhotoModel(photo).then(() => {
        actions.createSuccessAlert('Create Success!');
        app.router.navigate(`/cards/${newCard.id}`, { trigger: true });
      });
    }).catch((err) => {
      actions.createCardFailure(err);
      actions.createDangerAlert(err.message || 'Create failed.');
    });
  }

  render() {
    const { restaurant } = this.props.reducers;
    const { isUpdating } = this.props.reducers.card;
    const { cardHasChanged } = this.state;
    const { photos, status } = this.state.cardData;
    const photo = _.first(photos) || {};
    const restaurantOptions = this.getRestaurantOptions();
    
    return (
      <DefaultContainerLayout {...this.props}>
        <div className="CardCreateContainer">
          <div className="container-fluid">
            <div className="row">
              <div className="col-md-6">
                <h1>New Card</h1>
              </div>
            </div>
            <div className="row">
              <div className="col-md-12">
                <div className="panel panel-default">
                  <div className="panel-heading" />
                  <div className="panel-body">
                    <CardForm
                      restaurantList={restaurant.restaurantList}
                      restaurantOptions={restaurantOptions}
                      photo={photo}
                      status={status}
                      handleUpload={_.isEmpty(photo) ? this.onUploadPhoto : null}
                      onChange={(cardData) => {
                        if (!this.state.cardHasChanged) {
                          this.setState({ cardHasChanged: true });
                        }
                        this.setState({ cardData });
                      }}
                    />
                  </div>
                  <div className="panel-footer">
                    <button
                      className="btn btn-primary pull-right"
                      onClick={this.createCard}
                      disabled={!isUpdating && !cardHasChanged}
                    >
                      Create
                    </button>
                    <a
                      href="/#cards"
                      className="btn btn-default pull-right"
                      style={styles.backBtn}
                    >
                      Cancel
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DefaultContainerLayout>
    );
  }
}

export default CardCreateContainer;
