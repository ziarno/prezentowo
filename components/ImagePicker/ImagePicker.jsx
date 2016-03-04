ImagePicker = React.createClass({

  propTypes: {
    onChange: React.PropTypes.func.isRequired,
    images: React.PropTypes.array
  },

  getInitialState() {
    return {
      uploadedImage: null
    }
  },

  sendImage(event) {
    var files = event.currentTarget.files;

    Cloudinary.upload(files, {
      folder: 'users'
    }, (err, res) => {
      this.setState({
        uploadedImage: res
      });
      this.props.onChange({
        pictureUrl: res.secure_url
      });
    });
  },

  render() {
    return (
      <div className="image-picker shadow">
        <div className="image">
          <div className="arrow arrow--left">
            <i className="chevron left icon"></i>
          </div>
          <div className="arrow arrow--right">
            <i className="chevron right icon"></i>
          </div>
        </div>
        <div className="ui compact small buttons image-picker--actions">
          <label
            htmlFor="picture"
            className="ui icon right labeled button
              image-picker--upload waves-effect waves-button">
            <T>Upload file</T>
            <i className="upload icon"></i>
          </label>
          <input
            name="picture"
            id="picture"
            type="file"
            onChange={this.sendImage}
          />
          <div className="ui icon button waves-effect waves-button">
            <i className="search icon"></i>
          </div>
        </div>

      </div>
    );
  }
});