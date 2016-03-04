ImagePicker = React.createClass({

  propTypes: {
    onChange: React.PropTypes.func.isRequired
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
      <div className="image-picker">
        <input
          type="file"
          onChange={this.sendImage}
          />
      </div>
    );
  }
});