Ribbon = React.createClass({
  render() {
    return (
      <div className="ribbon">
        <div className="ribbon-stitches-top"></div>
        <strong className="ribbon-content">
          {this.props.children}
        </strong>
        <div className="ribbon-stitches-bottom"></div>
      </div>
    )
  }
});