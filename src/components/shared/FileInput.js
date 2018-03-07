import React from 'react';
import uuid from 'uuid/v4';

class InputFile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      file: null,
      uuidName: '',
    };
    this.getFile = this.getFile.bind(this);
    this.triggerClick = this.triggerClick.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.getFileName = this.getFileName.bind(this);
  }
  
  getFile() {
    return this.state.file;
  }
  
  getFileName() {
    if (this.state.file) {
      return this.state.file.name;
    }
    return '';
  }
  
  uploadWrapper(uploadMethod) {
    const formData = new FormData();
    const uuidName = `${uuid()}.jpg`;
    // formData.append('file', this.state.file);
    formData.set('file', this.state.file, uuidName);
    this.setState({ uuidName });
    return uploadMethod(formData);
  }
  
  triggerClick() {
    return this.inputFile.click();
  }
  
  handleChange(event) {
    const file = event.target.files[0];
    // restore base input value
    this.setState({ file });
  }
  
  cleanInput() {
    this.inputFile.value = '';
  }
  
  render() {
    return (
      <div className="image-upload">
        <input
          ref={(ref) => { this.inputFile = ref; }}
          id={this.props.id}
          type="file"
          name={this.props.name}
          defaultValue={this.props.defaultValue}
          className={this.props.className}
          placeholder={this.props.placeholder}
          style={this.props.style}
          accept={this.props.accept || '.png,.gif,.jpg,.jpeg,.tif,.tiff,.bmp'}
          onChange={this.handleChange}
        />
      </div>
    );
  }
}

export default InputFile;
