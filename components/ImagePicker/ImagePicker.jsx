ImagePicker = React.createClass({

  propTypes: {
    onChange: React.PropTypes.func.isRequired,
    images: React.PropTypes.array
  },

  getInitialState() {
    return {
      uploadedImages: [],
      currentIndex: 0,
      isLoading: false
    }
  },

  changeImage(count) {
    var imagesCount = this.props.images.length + this.state.uploadedImages.length;
    var nextIndex = (this.state.currentIndex + count + imagesCount) % imagesCount;
    this.setImage(nextIndex);
  },

  getImage(index = this.state.currentIndex) {
    return [...this.state.uploadedImages, ...this.props.images][index];
  },

  setImage(index = this.state.currentIndex) {
    this.setState({currentIndex: index});
    this.props.onChange({
      pictureUrl: this.getImage(index)
    });
  },

  sendImage(event) {
    var files = event.currentTarget.files;

    this.setState({isLoading: true});

    Cloudinary.upload(files, {
      folder: 'users'
    }, (err, res) => {
      if (err) {
        return this.setState({
          isLoading: false
        });
      }
      this.setState({
        uploadedImages: [res.secure_url, ...this.state.uploadedImages],
        currentIndex: 0,
        isLoading: false
      });
      this.props.onChange({
        pictureUrl: this.getImage(0)
      });
    });
  },

  reset() {
    this.setState(this.getInitialState());
  },

  render() {
    return (
      <div className="image-picker shadow">
        <Loader visible={this.state.isLoading} />
        <div
          className="image"
          style={{
            backgroundImage: `url(${this.getImage()})`
          }}>
          <div
            className="arrow arrow--left"
            onClick={this.changeImage.bind(this, -1)}>
            <i className="chevron left icon"></i>
          </div>
          <div
            className="arrow arrow--right"
            onClick={this.changeImage.bind(this, 1)}>
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