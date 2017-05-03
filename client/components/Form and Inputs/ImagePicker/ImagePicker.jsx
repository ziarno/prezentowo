import React, { PropTypes } from 'react'
import _ from 'underscore'
import { Cloudinary } from 'meteor/lepozepo:cloudinary'
import { classNames } from 'meteor/maxharris9:classnames'
import { _i18n } from 'meteor/universe:i18n'
import { ValidatedInput } from '../../../../lib/Mixins'

ImagePicker = class ImagePicker extends ValidatedInput {

  constructor(props) {
    super(props)
    this.inputId = `image-picker-input-${_.uniqueId()}`
    this.state = _.extend(this.state, {
      uploadedImages: [],
      currentIndex: props.randomizeInitialImage ?
        _.random(0, props.images.length - 1) : 0,
      isLoading: false
    })

    this.setNextImageIndex = this.changeImageIndex.bind(this, 1)
    this.setPreviousImageIndex = this.changeImageIndex.bind(this, -1)

    this.changeImageIndex = this.changeImageIndex.bind(this)
    this.getImage = this.getImage.bind(this)
    this.getValue = this.getValue.bind(this)
    this.setValue = this.setValue.bind(this)
    this.setImageIndex = this.setImageIndex.bind(this)
    this.addImage = this.addImage.bind(this)
    this.uploadImage = this.uploadImage.bind(this)
    this.reset = this.reset.bind(this)
  }
  
  changeImageIndex(count) {
    const imagesCount = this.props.images.length +
      this.state.uploadedImages.length
    const nextIndex = (this.state.currentIndex + count + imagesCount)
      % imagesCount
    this.setImageIndex(nextIndex)
  }

  getImage(index = this.state.currentIndex) {
    return [
      ...this.state.uploadedImages,
      ...this.props.images
    ][index]
  }

  getIndexOfPicture(picture) {
    return _.findIndex([
      ...this.state.uploadedImages,
      ...this.props.images
    ], pic => _.isEqual(pic, picture))
  }

  getValue() {
    return this.getImage()
  }

  setValue(picture) {
    const index = this.getIndexOfPicture(picture)
    if (index > -1) {
      this.setImageIndex(index)
    } else {
      this.addImage(picture)
    }
  }

  setImageIndex(index = this.state.currentIndex) {
    this.setState({currentIndex: index})
    this.onChange(this.getImage(index))
    this.validate(this.getImage(index))
  }

  addImage(picture) {
    this.setState({
      uploadedImages: [picture, ...this.state.uploadedImages]
    })
    this.setImageIndex(0)
  }

  uploadImage(event) {
    const files = event.currentTarget.files
    const {
      uploadOptions,
      responseTransformations
    } = this.props

    function makeObject(url) {
      const imageObject = {}

      responseTransformations.forEach(transformation => {
        imageObject[transformation] =
          url.replace('upload', `upload/t_${transformation}`)
      })

      if (uploadOptions.transformation) {
        imageObject[uploadOptions.transformation] = url
      }

      return imageObject
    }

    this.setState({isLoading: true})

    Cloudinary.upload(files, {
      ...uploadOptions,
      fields: {} // fix for lepozepo:cloudinary
    }, (err, res) => {
      this.setState({
        isLoading: false
      })

      if (err) {
        console.error('Image upload error: ', err.message)
      }

      if (!err && res) {
        let image = responseTransformations ?
          makeObject(res.secure_url) : res.secure_url
        this.addImage(image)
      }
    })
  }

  reset() {
    this.setState({
      uploadedImages: [],
      currentIndex: this.props.randomizeInitialImage ?
        _.random(0, this.props.images.length - 1) : 0,
      isLoading: false
    })
  }

  render() {
    const image = this.getImage()
    const imageToDisplay = _.isString(image) ? image :
      (image.small || image.large)

    return (
      <div
        className={classNames('image-picker shadow', {
          disabled: this.isDisabled()
        })}
      >
        <Loader
          inverted
          text={_i18n.__('Uploading')}
          visible={this.state.isLoading} />
        {this.isDisabled() ? (
          <Img src={imageToDisplay} />
        ) : (
          <Img
            src={imageToDisplay}>
            <ArrowField
              left
              onClick={this.setPreviousImageIndex}>
            </ArrowField>
            <ArrowField
              right
              onClick={this.setNextImageIndex}>
            </ArrowField>
          </Img>
        )}
        <div className="ui compact small buttons image-picker--actions">
          <label
            htmlFor={this.inputId}
            className={classNames(
              'ui icon right labeled button',
              'image-picker--upload waves-effect waves-button',
              {disabled: this.isDisabled()}
            )}>
            <T>Upload file</T>
            <i className="upload icon" />
          </label>
          <input
            name={this.inputId}
            id={this.inputId}
            type="file"
            onChange={this.uploadImage}
          />
          {this.props.enableSearch ? (
            <div className="ui icon button waves-effect waves-button">
              <i className="search icon" />
            </div>
          ) : null}
        </div>

      </div>
    )
  }

}

ImagePicker.propTypes = {
  images: PropTypes.oneOfType([
    PropTypes.arrayOf(
      PropTypes.shape({
        small: PropTypes.string,
        large: PropTypes.string
      })
    ),
    PropTypes.arrayOf(
      PropTypes.string
    )
  ]),
  uploadOptions: PropTypes.object,
  randomizeInitialImage: PropTypes.bool,
  enableSearch: PropTypes.bool
}
