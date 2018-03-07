import _ from 'lodash';
import React, { Component } from 'react';
import CardForm from './CardForm';
import CardApiConnectors from '../../api-connectors/CardApiConnectors';
import PhotoApiConnectors from '../../api-connectors/PhotoApiConnectors';
import DefaultContainerLayout from '../shared/layouts/DefaultContainerLayout';
import RestaurantApiConnectors from '../../api-connectors/RestaurantApiConnectors';

const styles = {
  backBtn: {
    marginRight: 10,
  },
};

class CardDetailContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cardData: {},
      cardHasChanged: false,
    };

    this.updateCardData = this.updateCardData.bind(this);
    this.onUploadPhoto = this.onUploadPhoto.bind(this);
  }

  componentDidMount() {
    const { actions, id } = this.props;
    const { restaurantList } = this.props.reducers.restaurant;

    if (restaurantList.length === 0) {
      actions.getRestaurantListRequest();
      RestaurantApiConnectors.getRestaurantList().then((data) => {
        actions.getRestaurantListSuccess(data);
      }).catch((err) => {
        actions.getRestaurantListFailure(err);
      });
    }

    actions.getCardDetailRequest();
    CardApiConnectors.getCardDetail(id).then((data) => {
      actions.getCardDetailSuccess(data);
      this.setState({ cardData: data });
    }).catch(() => {
      actions.getCardDetailFailure();
    });
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
        const newCardData = _.clone(cardData);
        const photos = new Array(data);
        _.assign(newCardData, { photos });
        actions.createSuccessAlert('Upload Success!');
        this.setState({ cardData: newCardData });
      }).catch((err) => {
        actions.createDangerAlert(err.message || 'Upload failed.');
      });
    });
  }

  getRestaurantOptions() {
    const { restaurantList } = this.props.reducers.restaurant;
    return _.map(restaurantList, res => ({ value: res.id, label: res.name }));
  }

  updateCardData() {
    const { id, actions } = this.props;
    const { cardData } = this.state;

    actions.updateCardRequest();
    const promise = CardApiConnectors.updateCardDetail(id, cardData);
    promise.then((data) => {
      actions.updateCardSuccess(data);
      actions.updateCardListSuccess(data);
      const photo = _.head(data.photos) || _.head(cardData.photos) || [];
      if (photo.url) {
        photo.cardId = data.id;
        PhotoApiConnectors.updatePhotoModel(photo).then(() => {
          const alertWordMap = {
            APPROVED: 'Approve',
            PENDING: 'Pending',
            REJECTED: 'Reject',
            DELETED: 'Delete',
          };
          this.CardForm.setCardFormValue(cardData);
          actions.createSuccessAlert(`${alertWordMap[this.state.cardData.status]} Success!`);
        });
      }
    }).catch((err) => {
      actions.updateCardFailure(err);
      actions.createDangerAlert(err.message || 'Update failed.');
    });
  }

  render() {
    const { id } = this.props;
    const { card } = this.props.reducers;
    const { isRequestingDetail, isUpdating, cardDetails } = card;
    const { name, description, restaurantName, restaurant,
            tags, status, upvotes, downvotes } = card.cardDetails;
    const { cardHasChanged, cardData } = this.state;

    const isPageReady = _.some(card.cardDetails, { id });

    if (card.isRequestingDetail && !isPageReady) {
      return (
        <div>Loading Data...</div>
      );
    }

    const restaurantOptions = this.getRestaurantOptions();
    const photo = _.first(cardDetails.photos) || _.first(cardData.photos) || {};
    return (
      <DefaultContainerLayout {...this.props}>
        <div className="CardDetailContainer">
          <div className="container-fluid">
            <div className="row">
              <div className="col-md-6">
                <h1>Card Detail</h1>
              </div>
            </div>
            <div className="row">
              <div className="col-md-12">
                <div className="panel panel-default">
                  <div className="panel-heading">
                    <h2>{name}</h2>
                  </div>
                  <div className="panel-body">
                    {isRequestingDetail ? (<div>Loading...</div>) : (
                      <CardForm
                        name={name}
                        description={description}
                        restaurantOptions={restaurantOptions}
                        restaurantName={restaurantName}
                        restaurant={restaurant}
                        tags={tags}
                        status={status}
                        ref={(ref) => { this.CardForm = ref; }}
                        photo={photo}
                        handleUpload={_.isEmpty(photo) ? this.onUploadPhoto : null}
                        upvotes={upvotes}
                        downvotes={downvotes}
                        onChange={(newcardData) => {
                          if (!this.state.cardHasChanged) {
                            this.setState({ cardHasChanged: true });
                          }
                          this.setState({ cardData: newcardData });
                        }}
                      />
                  )}
                  </div>
                  <div className="panel-footer">
                    <button
                      className="btn btn-primary pull-right"
                      onClick={this.updateCardData}
                      disabled={!isUpdating && !cardHasChanged}
                    >
                      Submit
                    </button>
                    <a
                      href="/#cards"
                      className="btn btn-default pull-right"
                      style={styles.backBtn}
                    >
                      Back
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

export default CardDetailContainer;
