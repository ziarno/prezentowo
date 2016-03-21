VerticalSlideToggle = class VerticalSlideToggle extends React.Component {

  constructor() {
    super()
    this.state = {
      visible: true,
      maxHeight: false
    }
    this.setHeight = this.setHeight.bind(this)
    this.toggle = this.toggle.bind(this)
  }

  setHeight(visible = this.state.visible) {
    this.setState({
      visible,
      maxHeight: visible ? this.refs.slideToggle.scrollHeight : 0
    });
  }

  toggle() {
    this.setHeight(!this.state.visible);
    if (_.isFunction(this.props.onToggle)) {
      this.props.onToggle(!this.state.visible);
    }
  }

  componentDidUpdate(prevProps, {maxHeight}) {
    if (maxHeight !== 0 &&
      maxHeight !== this.refs.slideToggle.scrollHeight) {
      this.setHeight();
    }
  }

  componentDidMount() {
    this.setHeight();
  }

  render() {
    var style = {
      opacity: this.state.visible ? 1 : 0.4
    };

    if (this.state.maxHeight !== false) {
      style.maxHeight = this.state.maxHeight;
    }

    return (
      <div
        id={this.props.id}
        ref="slideToggle"
        style={style}
        className={classNames('vertical-slide-toggle', this.props.className)}>
        {this.props.children}
      </div>
    );
  }
}

VerticalSlideToggle.propTypes = {
  onToggle: React.PropTypes.func,
  className: React.PropTypes.string,
  id: React.PropTypes.string
}