import _ from 'lodash';
import React, { Component } from 'react';
import Select from 'react-select';
import PropTypes from 'prop-types';
import config from '../../app/config';
import FileInput from '../shared/FileInput';
import { CARD_STATUS } from '../../constants/CardConstants';
import FormGroupInput from '../shared/FormGroupInput';

const styles = {
  list: {
    marginTop: 10,
    marginLeft: 90,
  },
  statusBtn: {
    opacity: 1,
  },
  img: {
    height: '360px',
    width: '360px',
    margin: 'auto',
  },
};

class CardForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      restaurantOptions: [],
      restaurantId: {},
      status: '',
      shouldRenderSelect: false,
    };

    this.onChangeInputValue = this.onChangeInputValue.bind(this);
    this.onChangeRestaurant = this.onChangeRestaurant.bind(this);
    this.onChangeStatus = this.onChangeStatus.bind(this);
    this.handleUpload = this.handleUpload.bind(this);
    this.getRestaurantOptions = this.getRestaurantOptions.bind(this);
  }

  componentDidMount() {
    const { restaurantOptions, restaurant, status } = this.props;
    const defaultRestaurantId = {
      label: 'Select a restaurant',
      value: -1,
    };
    const restaurantId = _.find(restaurantOptions, { value: restaurant.id }) || defaultRestaurantId;
    const shouldRenderSelect = (restaurantOptions.length !== 0);
    this.setState({  // eslint-disable-line
      restaurantOptions,
      restaurantId,
      status,
      shouldRenderSelect,
    });
  }
  
  componentWillReceiveProps(nextProps) {
    const { restaurantOptions } = nextProps;
    const shouldRenderSelect = (restaurantOptions.length !== 0);
    this.setState({
      restaurantOptions,
      shouldRenderSelect,
    });
  }
  
  onChangeInputValue() {
    this.props.onChange.call(null, this.getDataFromCardForm());
  }

  onChangeRestaurant(restaurantId) {
    this.setState({ restaurantId }, () => {
      this.props.onChange.call(null, this.getDataFromCardForm());
    });
  }
  
  onChangeStatus(status) {
    this.setState({ status }, () => {
      this.props.onChange.call(null, this.getDataFromCardForm());
    });
  }

  getPhotoUrl(photo) {
    return `${config.apiUrl}/${photo.url}`;
  }

  getDataFromCardForm() {
    const { restaurantList, photo } = this.props;
    const { status, restaurantId } = this.state;
    const newRes = _.find(restaurantList, { id: restaurantId.value });
    return {
      name: this.nameInput.value.trim(),
      restaurantName: this.restaurantNameInput.value.trim(),
      description: this.descriptionInput.value.trim(),
      restaurant: newRes,
      restaurantId: restaurantId.value,
      tags: this.parseTags(this.tagsStr.value.trim()),
      status,
      photos: new Array(photo),
    };
  }

  setCardFormValue(data) {
    this.nameInput.value = data.name;
    this.descriptionInput.value = data.description;
    this.tagsStr.value = data.tags.join();
  }
  
  getRestaurantOptions(input, callback) {
    const { restaurantOptions } = this.state;
    const filteredOptions = restaurantOptions.filter((option) => {
      const inputLowerCase = input.toLowerCase();
      return option.label.toLocaleLowerCase().includes(inputLowerCase);
    });
    const data = {
      options: filteredOptions.slice(0, 10),
      complete: true,
    };
    setTimeout(() => {
      callback(null, data);
    }, 500);
    // loadOption function can work without calling this callback with setTimeout,
    // but it's a practice that can be found among the examples on the Internet.
  }
  
  handleUpload() {
    this.props.handleUpload.call(null, this.uploadPhoto);
  }

  parseTags(tagsStr) {
    const rawTags = tagsStr.split(/[\s,#]+/);
    return _.uniq(_.pull(rawTags, ''));
  }

  render() {
    const { name, description, tags, upvotes, downvotes,
            photo, restaurantName, restaurant } = this.props;
    const { restaurantId, status, shouldRenderSelect } = this.state;
    const { APPROVED, PENDING, REJECTED, DELETED } = CARD_STATUS;
    let tagsStr = '';
    _.forEach(tags, (tag) => {
      tagsStr += `${tag.name},`;
    });
    tagsStr = tagsStr.slice(0, tagsStr.length - 1);
    
    return (
      <div className="row">
        <div className="col-md-4">
          <div className="img-rounded img-responsive" style={styles.img} >
            { _.isEmpty(photo) ? (
              <div className="center-block">
                <FileInput
                  id={this.props.id}
                  ref={(ref) => { this.uploadPhoto = ref; }}
                  defaultValue="upload photo"
                  placeholder="choose a photo to upload"
                />
                <button
                  className="btn btn-default"
                  onClick={this.handleUpload}
                >
                Upload
                </button>
              </div>
            ) : (
              <img
                className="img-responsive"
                style={styles.img}
                src={this.getPhotoUrl(photo)}
                alt=""
              />
            )}
          </div>
          <div className="row center-block" >
            <ul className="list-inline" >
              <li style={styles.list} >
                <i className="fa fa-2x fa-thumbs-up" />
                {upvotes}
              </li>
              <li style={styles.list} >
                <i className="fa fa-2x fa-thumbs-down" />
                {downvotes}
              </li>
            </ul>
          </div>
        </div>
        <div className="col-md-6" style={{ marginLeft: 20 }}>
          <form className="form-horizontal" >
            <FormGroupInput
              label="Name of Restaurant"
              id="restaurantNameInput"
              type="text"
              defaultValue={restaurantName || restaurant.name}
              onChange={this.onChangeInputValue}
              refFunc={(input) => { this.restaurantNameInput = input; }}
              disabled
            />
            <FormGroupInput
              label="Name"
              id="nameInput"
              type="text"
              defaultValue={name}
              onChange={this.onChangeInputValue}
              refFunc={(input) => { this.nameInput = input; }}
            />
            <FormGroupInput
              label="Description"
              id="descriptionInput"
              type="text"
              defaultValue={description}
              onChange={this.onChangeInputValue}
              refFunc={(input) => { this.descriptionInput = input; }}
            />
            <div className="form-group">
              <label htmlFor="restaurantSelect" className="control-label">Restaurant</label>
              {(shouldRenderSelect) && (
                <Select.Async
                  id="restaurantSelect"
                  loadOptions={this.getRestaurantOptions}
                  onChange={this.onChangeRestaurant}
                  onInputChange={this.onInputChange}
                  value={restaurantId}
                />
              )}
            </div>
            <FormGroupInput
              label="Tags"
              id="tagsInput"
              type="text"
              defaultValue={tagsStr}
              onChange={this.onChangeInputValue}
              refFunc={(input) => { this.tagsStr = input; }}
            />
            <div className="FormGroupInput form-group">
              <label htmlFor="statusButton" className="control-label">Status</label>
              <div className="form-control btn-group" style={{ border: 'none' }}>
                <button
                  type="radio"
                  className={status === APPROVED ? 'btn btn-success btn' : 'btn btn-success-alt'}
                  onClick={() => this.onChangeStatus(APPROVED)}
                  style={styles.statusBtn}
                  disabled={status === APPROVED}
                >Approved</button>
                <button
                  type="radio"
                  className={status === PENDING ? 'btn btn-warning btn' : 'btn btn-warning-alt'}
                  onClick={() => this.onChangeStatus(PENDING)}
                  style={styles.statusBtn}
                  disabled={status === PENDING}
                >Pending</button>
                <button
                  type="radio"
                  className={status === REJECTED ? 'btn btn-midnightblue btn' : 'btn btn-midnightblue-alt'}
                  onClick={() => this.onChangeStatus(REJECTED)}
                  style={styles.statusBtn}
                  disabled={status === REJECTED}
                >Rejected</button>
                <button
                  type="radio"
                  className={status === DELETED ? 'btn btn-danger btn' : 'btn btn-danger-alt'}
                  onClick={() => this.onChangeStatus(DELETED)}
                  style={styles.statusBtn}
                  disabled={status === DELETED}
                >DELETE</button>
              </div>
            </div>
          </form>
        </div>
      </div>
    );
  }
}
CardForm.PropTypes = {
  name: PropTypes.string.isRequired,
  restaurantName: PropTypes.string,
  description: PropTypes.string,
  restaurantOptions: PropTypes.array,
  restaurant: PropTypes.object,
  tags: PropTypes.object,
  status: PropTypes.string.isRequired,
  onChange: PropTypes.func,
  upvotes: PropTypes.number,
  downvotes: PropTypes.number,
  photo: PropTypes.object,
  handleUpload: PropTypes.func,
};

CardForm.defaultProps = {
  description: '',
  restaurantName: null,
  restaurantOptions: [],
  restaurant: {},
  tags: {},
  onChange: () => {},
  upvotes: 0,
  downvotes: 0,
  photo: {},
  handleUpload: () => {},
};

export default CardForm;
