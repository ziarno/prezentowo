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
    this.image = new Image()
    clearTimeout(this.loadTimeout)
    this.loadTimeout = setTimeout(() => {
      this.setState({isLoading: true})
    }, 300)

    this.image.onload = this.image.onerror = () => {
      clearTimeout(this.loadTimeout)
      this.setState({isLoading: false})
    }
    this.image.src = src
  }

  render() {
    return (
      <div className={classNames('img', this.props.className)}
        style={{
          backgroundImage: `url(${this.props.src})`
        }}>
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
  hideLoader: React.PropTypes.bool
}