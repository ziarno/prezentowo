VerticalSlideToggle = React.createClass({

  propTypes: {
    onToggle: React.PropTypes.func
  },

  getInitialState() {
    return {
      visible: true,
      maxHeight: false
    };
  },

  setHeight(visible = this.state.visible) {
    this.setState({
      visible,
      maxHeight: visible ? this.refs.slideToggle.scrollHeight : 0
    });
  },

  toggle() {
    this.setHeight(!this.state.visible);
    if (_.isFunction(this.props.onToggle)) {
      this.props.onToggle(!this.state.visible);
    }
  },

  componentDidUpdate(prevProps, {maxHeight}) {
    if (maxHeight !== 0 &&
      maxHeight !== this.refs.slideToggle.scrollHeight) {
      this.setHeight();
    }
  },

  componentDidMount() {
    this.setHeight();
  },

  render() {
    var style = {};

    if (this.state.maxHeight !== false) {
      style.maxHeight = this.state.maxHeight;
    }

    return (
      <div
        ref="slideToggle"
        style={style}
        className="vertical-slide-toggle">
        {this.props.children}
      </div>
    );
  }
});