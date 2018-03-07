import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select';
import _ from 'lodash';

import FormGroupInput from '../shared/FormGroupInput';
import OpeningHoursEditor from './OpeningHoursEditor';
import PhotoUploadManager from '../shared/PhotoUploadManager';
import CardsViewer from './CardsViewer';

const styles = {
  descriptionTextarea: {
    height: 150,
    resize: 'none',
  },
};

class RestaurantEditor extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedCuisineTypeOptions: [],
      photoUrls: [],
      updatedOpeningHours: {
        periods: [],
      },
    };

    this.onChangeInputValue = this.onChangeInputValue.bind(this);
    this.onChangeCuisineTypes = this.onChangeCuisineTypes.bind(this);
    this.onChangeOpeningHours = this.onChangeOpeningHours.bind(this);
  }

  componentDidMount() {
    const { cuisineTypes, openingHours, photos } = this.props.restaurant;
    const { selectedCuisineTypeOptions } = this.state;

    // parse cuisine types from props to state for react-select to use
    if (cuisineTypes && selectedCuisineTypeOptions.length === 0 && cuisineTypes.length !== 0) {
      this.setState({ // eslint-disable-line
        selectedCuisineTypeOptions: cuisineTypes.map(cuisineType => ({
          value: cuisineType.id,
          label: cuisineType.name,
        })),
      });
    }

    // pass in openingHours as default editing state
    if (openingHours !== undefined && !_.isEmpty(openingHours)) {
      this.setState({updatedOpeningHours: openingHours}); // eslint-disable-line
    }
    
    if (photos !== undefined) {
      this.setState({ photoUrls: photos.map(photo => photo.url) }); // eslint-disable-line
    }
  }
  
  componentWillReceiveProps(nextProps) {
    const { photos } = nextProps.restaurant;
    if (photos !== undefined) {
      this.setState({ photoUrls: photos.map(photo => photo.url) });
    }
  }
  
  onChangeInputValue() {
    this.props.onChange.call(null, this.getRestaurantDataFromForm());
  }

  onChangeCuisineTypes(val) {
    this.setState({ selectedCuisineTypeOptions: val }, () => {
      this.props.onChange.call(null, this.getRestaurantDataFromForm());
    });
  }

  onChangeOpeningHours(updatedOpeningHours) {
    this.setState({ updatedOpeningHours }, () => {
      this.props.onChange.call(null, this.getRestaurantDataFromForm());
    });
  }

  getRestaurantDataFromForm() {
    return {
      // basic info
      name: this.nameInput.value.trim(),
      description: this.descriptionInput.value.trim(),
      phone: this.phoneInput.value.trim(),
      website: this.websiteInput.value.trim(),
      yelpUrl: this.yelpUrlInput.value.trim(),
      price: this.priceInput.value,
      rating: this.ratingInput.value,
      reviews: this.reviewsInput.value,
      // location
      address: this.addressInput.value.trim(),
      city: this.cityInput.value.trim(),
      state: this.stateInput.value.trim(),
      zipcode: this.zipcodeInput.value.trim(),
      latLng: {
        lat: this.latInput.value,
        lng: this.lngInput.value,
      },
      neighborhood: this.neighborhoodInput.value.trim(),
      // opening hours
      openingHours: this.state.updatedOpeningHours,
      // others
      businessOwner: this.businessOwnerInput.value.trim(),
      contact: this.contactInput.value.trim(),
      goodFor: this.goodForInput.value.trim(),
      merchantVerified: this.merchantVerifiedInput.checked,
      // relational data
      cuisineTypes: this.parseCuisineTypeOptions(this.state.selectedCuisineTypeOptions),
    };
  }

  getCuisineTypeOptions() {
    return this.props.cuisineTypes.map(ct => ({ value: ct.id, label: ct.name }));
  }

  parseCuisineTypeOptions(options) {
    // parse option objects to data in original format {id: 1, label: 'Sushi Bar'}
    return options.map(opt => ({ id: opt.value, name: opt.label }));
  }
  

  render() {
    const { name, description, phone, website, yelpUrl, price, rating, reviews, // basic info
      address, city, state, zipCode, latLng, neighborhood, // location
      businessOwner, contact, goodFor, merchantVerified, // others
    } = this.props.restaurant;
    const { selectedCuisineTypeOptions, updatedOpeningHours } = this.state;
    return (
      <div className="RestaurantEditor">
        <form>
          <h3>Basics</h3>
          <hr />
          <FormGroupInput
            label="Name"
            id="nameeInput"
            defaultValue={name}
            onChange={this.onChangeInputValue}
            refFunc={(input) => { this.nameInput = input; }}
          />
          <div className="form-group">
            <label
              htmlFor="descriptionInput"
              className="control-label"
            >
              Description - optional
            </label>
            <textarea
              id="descriptionInput"
              type="text"
              className="form-control"
              placeholder="Enter Description..."
              style={styles.descriptionTextarea}
              defaultValue={description}
              onChange={this.onChangeInputValue}
              ref={(input) => { this.descriptionInput = input; }}
            />
          </div>
          <FormGroupInput
            label="Phone"
            id="phoneInput"
            defaultValue={phone}
            onChange={this.onChangeInputValue}
            refFunc={(input) => { this.phoneInput = input; }}
          />
          <FormGroupInput
            label="Website"
            id="websiteInput"
            defaultValue={website}
            onChange={this.onChangeInputValue}
            refFunc={(input) => { this.websiteInput = input; }}
          />
          <FormGroupInput
            label="Yelp URL"
            id="yelpUrlInput"
            defaultValue={yelpUrl}
            onChange={this.onChangeInputValue}
            refFunc={(input) => { this.yelpUrlInput = input; }}
          />
          <FormGroupInput
            label="Price (1 to 4)"
            id="priceInput"
            type="number"
            min={1}
            max={4}
            defaultValue={price}
            onChange={this.onChangeInputValue}
            refFunc={(input) => { this.priceInput = input; }}
          />
          <FormGroupInput
            label="Rating"
            id="ratingInput"
            type="number"
            min={0}
            max={5}
            defaultValue={rating}
            onChange={this.onChangeInputValue}
            refFunc={(input) => { this.ratingInput = input; }}
          />
          <FormGroupInput
            label="# of Reviews"
            id="reviewsInput"
            type="number"
            min={0}
            defaultValue={reviews}
            onChange={this.onChangeInputValue}
            refFunc={(input) => { this.reviewsInput = input; }}
          />
          <label htmlFor="cuisineTypeSelect" className="control-label">Cuisine Types</label>
          <Select
            id="cuisineTypeSelect"
            value={selectedCuisineTypeOptions}
            options={this.getCuisineTypeOptions()}
            onChange={(val) => { this.onChangeCuisineTypes(val); }}
            multi
          />

          <h3>Opening Hours</h3>
          <hr />
          <OpeningHoursEditor
            openingHours={updatedOpeningHours}
            onChange={this.onChangeOpeningHours}
          />

          <h3>Location</h3>
          <hr />
          <div className="form-group">
            <label htmlFor="addressInput" className="control-label">Address</label>
            <input
              id="addressInput"
              type="text"
              className="form-control"
              placeholder="Enter Address..."
              defaultValue={address}
              onChange={this.onChangeInputValue}
              ref={(input) => { this.addressInput = input; }}
            />
          </div>
          <div className="form-group">
            <label htmlFor="cityInput" className="control-label">City</label>
            <input
              id="cityInput"
              type="text"
              className="form-control"
              placeholder="Enter City..."
              defaultValue={city}
              onChange={this.onChangeInputValue}
              ref={(input) => { this.cityInput = input; }}
            />
          </div>
          <div className="form-group">
            <label htmlFor="stateInput" className="control-label">State</label>
            <input
              id="stateInput"
              type="text"
              className="form-control"
              placeholder="Enter State..."
              defaultValue={state}
              onChange={this.onChangeInputValue}
              ref={(input) => { this.stateInput = input; }}
            />
          </div>
          <div className="form-group">
            <label htmlFor="zipcodeInput" className="control-label">Zipcode</label>
            <input
              id="zipcodeInput"
              type="text"
              className="form-control"
              placeholder="Enter Zipcode..."
              pattern="[0-9]{5}"
              defaultValue={zipCode}
              onChange={this.onChangeInputValue}
              ref={(input) => { this.zipcodeInput = input; }}
            />
          </div>
          <div className="form-group">
            <label htmlFor="latInput" className="control-label">Latitude</label>
            <input
              id="latInput"
              type="number"
              className="form-control"
              placeholder="Enter Geo Point - Lat..."
              defaultValue={latLng ? latLng.lat : 0}
              onChange={this.onChangeInputValue}
              ref={(input) => { this.latInput = input; }}
            />
          </div>
          <div className="form-group">
            <label htmlFor="lngInput" className="control-label">Longitude</label>
            <input
              id="lngInput"
              type="number"
              className="form-control"
              placeholder="Enter Geo Point - Lng..."
              defaultValue={latLng ? latLng.lng : 0}
              onChange={this.onChangeInputValue}
              ref={(input) => { this.lngInput = input; }}
            />
          </div>
          <div className="form-group">
            <label htmlFor="neighborhoodInput" className="control-label">Neighborhood</label>
            <input
              id="neighborhoodInput"
              type="text"
              className="form-control"
              placeholder="Enter Neighborhood..."
              defaultValue={neighborhood}
              onChange={this.onChangeInputValue}
              ref={(input) => { this.neighborhoodInput = input; }}
            />
          </div>
          <h3>Others</h3>
          <hr />
          <div className="form-group">
            <label htmlFor="businessOwnerInput" className="control-label">Business Owner</label>
            <input
              id="businessOwnerInput"
              type="text"
              className="form-control"
              placeholder="Enter Business Owner..."
              defaultValue={businessOwner}
              onChange={this.onChangeInputValue}
              ref={(input) => { this.businessOwnerInput = input; }}
            />
          </div>
          <div className="form-group">
            <label htmlFor="contactInput" className="control-label">Contact</label>
            <input
              id="contactInput"
              type="text"
              className="form-control"
              placeholder="Enter Contact..."
              defaultValue={contact}
              onChange={this.onChangeInputValue}
              ref={(input) => { this.contactInput = input; }}
            />
          </div>
          <div className="form-group">
            <label htmlFor="goodForInput" className="control-label">Good For - optional</label>
            <input
              id="goodForInput"
              type="text"
              className="form-control"
              placeholder="Enter Good For - optional..."
              defaultValue={goodFor}
              onChange={this.onChangeInputValue}
              ref={(input) => { this.goodForInput = input; }}
            />
          </div>
          <div className="form-group">
            <label htmlFor="merchantVerifiedInput" className="checkbox-inline">
              <input
                id="merchantVerifiedInput"
                type="checkbox"
                defaultChecked={merchantVerified}
                onChange={this.onChangeInputValue}
                ref={(input) => { this.merchantVerifiedInput = input; }}
              />
              Merchant Verified - optional
            </label>
          </div>
          <h3>Photos</h3>
          <hr />
          <PhotoUploadManager
            photoUrls={this.state.photoUrls}
            id={this.props.photoUploaderId}
            onUpload={this.props.onUploadPhoto}
            onDelete={this.props.onDeletePhoto}
          />
          {!(this.props.restaurantCards.length === 0) && ([
            <h3 key="cardTitle">Cards</h3>,
            <hr key="cardTitleBlank" />,
            <CardsViewer
              key="cardsViewer"
              restaurantCards={this.props.restaurantCards}
            />,
          ])}
        </form>
      </div>
    );
  }
}

RestaurantEditor.propTypes = {
  restaurant: PropTypes.shape({
    name: PropTypes.string,
  }),
  cuisineTypes: PropTypes.array,
  onChange: PropTypes.func,
  photoUploaderId: PropTypes.string.isRequired,
  onUploadPhoto: PropTypes.func.isRequired,
  onDeletePhoto: PropTypes.func.isRequired,
  restaurantCards: PropTypes.arrayOf(PropTypes.object).isRequired,
};

RestaurantEditor.defaultProps = {
  restaurant: {
    name: '',
    latLng: {
      lat: 0,
      lng: 0,
    },
  },
  cuisineTypes: [],
  onChange: (restaurantData) => {}, // eslint-disable-line
};

export default RestaurantEditor;
