Img = React.createClass({

  propTypes: {
    src: React.PropTypes.string,
    hideLoader: React.PropTypes.bool
  },

  getInitialState() {
    return {
      isLoading: false
    };
  },

  componentWillReceiveProps(newProps) {
    if (newProps.src !== this.props.src) {
      this.loadImage(newProps.src);
    }
  },

  componentDidMount() {
    this.loadImage();
  },

  loadImage(src = this.props.src) {
    var image = new Image();
    var timeout = setTimeout(() => this.setState({isLoading: true}), 300);

    image.onload = image.onerror = () => {
      clearTimeout(timeout);
      this.setState({isLoading: false});
    };
    image.src = src;
  },

  render() {
    return (
      <div className={classNames('img', this.props.className)}
        style={{
          backgroundImage: `url(${this.props.src})`
        }}>
        <Loader
          visible={this.state.isLoading && !this.props.hideLoader}
        />
        {this.props.children}
      </div>
    );
  }
});