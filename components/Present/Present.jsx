Present = React.createClass({

  propTypes: {
    present: React.PropTypes.object.isRequired
  },

  render() {
    return (
      <div>
        {this.props.present.title}
      </div>
    )
  }
});