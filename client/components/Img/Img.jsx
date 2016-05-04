import React from 'react'

Img = class Img extends React.Component {

  constructor() {
    super()
    this.state = {
      isLoading: false
    }
    this.image = null
    this.loadTimeout = null
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

  render() {
    var style = {
      backgroundImage: `url(${this.props.src})`
    }

    if (this.image &&
        this.props.autosize &&
        !this.state.isLoading) {
      style.width = this.image.width
      style.height = this.image.height
    }

    return (
      <div
        onClick={this.props.onClick}
        className={classNames('img', this.props.className)}
        style={style}>

        {this.state.isLoading && !this.props.hideLoader ? (
          <Loader />
        ) : null}

        {this.props.children}

      </div>
    )
  }

}

Img.propTypes = {
  src: React.PropTypes.string.isRequired,
  autosize: React.PropTypes.bool,
  hideLoader: React.PropTypes.bool,
  onClick: React.PropTypes.func,
  onLoad: React.PropTypes.func
}