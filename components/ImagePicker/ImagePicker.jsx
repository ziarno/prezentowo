import {InputValidation} from '../../lib/Mixins';

ImagePicker = React.createClass({

  mixins: [InputValidation],

  propTypes: {
    images: React.PropTypes.array
  },

  getInitialState() {
    return {
      uploadedImages: [],
      currentIndex: 0,
      isLoading: false
    }
  },

  changeImageIndex(count) {
    var imagesCount = this.props.images.length + this.state.uploadedImages.length;
    var nextIndex = (this.state.currentIndex + count + imagesCount) % imagesCount;
    this.setImageIndex(nextIndex);
  },

  getImage(index = this.state.currentIndex) {
    return [...this.state.uploadedImages, ...this.props.images][index];
  },

  getValue() {
    return this.getImage();
  },

  setImageIndex(index = this.state.currentIndex) {
    this.setState({currentIndex: index});
    this.onChange(this.getImage(index));
    this.validate(this.getImage(index));
  },

  addImage(pictureUrl) {
    this.setState({
      uploadedImages: [pictureUrl, ...this.state.uploadedImages]
    });
    this.setImageIndex(0);
  },

  uploadImage(event) {
    var files = event.currentTarget.files;

    this.setState({isLoading: true});

    Cloudinary.upload(files, {
      folder: 'users',
      transformation: 'avatar-large'
    }, (err, res) => {
      this.setState({
        isLoading: false
      });
      if (!err && res) {
        this.addImage(res.secure_url);
      }
    });
  },

  reset() {
    this.setState(this.getInitialState());
  },

  render() {
    return (
      <div className="image-picker shadow">
        <Loader visible={this.state.isLoading} />
        <Img
          src={this.getImage()}>
          <div
            className="arrow arrow--left"
            onClick={this.changeImageIndex.bind(this, -1)}>
            <i className="chevron left icon"></i>
          </div>
          <div
            className="arrow arrow--right"
            onClick={this.changeImageIndex.bind(this, 1)}>
            <i className="chevron right icon"></i>
          </div>
        </Img>
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
            onChange={this.uploadImage}
          />
          <div className="ui icon button waves-effect waves-button">
            <i className="search icon"></i>
          </div>
        </div>

      </div>
    );
  }
});