Present = React.createClass({

  propTypes: {
    present: React.PropTypes.object.isRequired
  },

  render() {
    return (
      <div className="present ui card">
        <Img
          className="image"
          src={this.props.present.pictureUrl}
        />
        <Ribbon
          color={this.props.present.isOwn() ? 'green' : 'red'}
          small>
          {this.props.present.title}
        </Ribbon>
        <div></div>{/* leave this empty div because semantic ui has strong css rules for the last element in a card (for border-radius)*/}
      </div>
    );
  }
});