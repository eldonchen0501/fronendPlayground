import React, { Component } from 'react';
import PropTypes from 'prop-types';

import FileInput from './FileInput';
import config from '../../app/config';
import deleteIcon from '../../styles/img/delete_image_icon.png';

class PhotoUploadManager extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.renderPhotos = this.renderPhotos.bind(this);
    this.handleUpload = this.handleUpload.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
  }
  
  handleUpload(e) {
    e.preventDefault();
    this.props.onUpload.call(null, this.uploadPhoto);
  }
  
  handleDelete(photoUrl) {
    this.props.onDelete.call(null, photoUrl);
  }
  
  renderPhotoRow(photos) {
    const returnPhotos = [];
    photos.forEach((photoUrl) => {
      returnPhotos.push(
        <div className="col-md-3" key={photoUrl}>
          <div className="image">
            <img
              src={config.apiUrl + photoUrl}
              className="img-responsive"
              alt=" "
              style={{ position: 'relative' }}
            />
            <img
              src={deleteIcon}
              alt=" "
              style={{ height: '20px', width: '20px', position: 'absolute', top: '0px', left: '20px' }}
              onClick={() => { this.handleDelete(photoUrl); }}
            />
          </div>
        </div>
      );
    });
    return returnPhotos;
  }
  
  renderPhotos() {
    const returnPhotos = [];
    for (let i = 0; i < this.props.photoUrls.length; i += 4) {
      returnPhotos.push(
        <div className="row" style={{ margin: '10px 0px 10px 0px' }} key={`row${i}`}>
          {this.renderPhotoRow(this.props.photoUrls.slice(i, i + 4))}
        </div>
      );
    }
    return returnPhotos;
  }
  
  
  render() {
    return (
      <div className="photoUploadManager">
        <div className="container-fluid">
          <div className="row">
            {this.renderPhotos()}
          </div>
          <div className="row" style={{ padding: '20px 0px' }}>
            <FileInput
              id={this.props.id}
              ref={(ref) => { this.uploadPhoto = ref; }}
              onChange={this.onChange}
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
        </div>
      </div>
    );
  }
}

PhotoUploadManager.propTypes = {
  photoUrls: PropTypes.arrayOf(PropTypes.string),
  onUpload: PropTypes.func.isRequired,
  id: PropTypes.string,
  onDelete: PropTypes.func.isRequired,
};

PhotoUploadManager.defaultProps = {
  photoUrls: [],
  id: '',
};

export default PhotoUploadManager;
