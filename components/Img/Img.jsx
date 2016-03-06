Img = React.createClass({

  propTypes: {
    src: React.PropTypes.string.isRequired,
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

    this.setState({isLoading: true});
    image.onload = () => this.setState({isLoading: false});
    image.onerror = () => this.setState({isLoading: false});
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