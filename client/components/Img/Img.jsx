import React from 'react'

Img = class Img extends React.Component {

  constructor() {
    super()
    this.state = {
      isLoading: false
    }
    this.image = null
    this.loadTimeout = null
    this.showModalWithPicture = this.showModalWithPicture.bind(this)
  }

  componentWillReceiveProps(newProps) {
    if (newProps.src !== this.props.src) {
      this.loadImage(newProps.src)
    }
  }

  componentDidMount() {
    this.loadImage()
  }

  componentWillUnmount() {
    clearTimeout(this.loadTimeout)
    this.image.onload = this.image.onerror = null
  }

  loadImage(src = this.props.src) {
    var {onLoad} = this.props

    this.image = new Image()
    clearTimeout(this.loadTimeout)
    this.loadTimeout = setTimeout(() => {
      this.setState({isLoading: true})
    }, 300)

    this.image.onload = this.image.onerror = () => {
      clearTimeout(this.loadTimeout)
      this.setState({isLoading: false})
      if (_.isFunction(onLoad)) {
        onLoad(this.image)
      }
    }
    this.image.src = src
  }

  showModalWithPicture() {
    ModalManager.open(
      <Lightbox picture={this.props.modalSrc} />,
      {id: 'lightbox'}
    )
  }

  render() {
    var {
      autosize,
      className,
      hideLoader,
      loaderOptions,
      children,
      modalSrc
    } = this.props
    var style = {
      backgroundImage: `url(${this.props.src})`
    }
    var onClick = modalSrc ?
      this.showModalWithPicture :
      this.props.onClick

    if (this.image &&
        autosize &&
        !this.state.isLoading) {
      style.width = this.image.width
      style.height = this.image.height
    }

    return (
      <div
        onClick={onClick}
        className={classNames('img', className, {
          enlarge: !!modalSrc
        })}
        style={style}>

        {this.state.isLoading && !hideLoader ? (
          <Loader
            inverted
            {...loaderOptions}
          />
        ) : null}

        {children}

      </div>
    )
  }

}

Img.propTypes = {
  src: React.PropTypes.string.isRequired,
  modalSrc: React.PropTypes.string,
  autosize: React.PropTypes.bool,
  hideLoader: React.PropTypes.bool,
  onClick: React.PropTypes.func,
  onLoad: React.PropTypes.func,
  loaderOptions: React.PropTypes.object
}