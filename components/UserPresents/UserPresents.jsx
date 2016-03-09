UserPresents = React.createClass({

  propTypes: {
    user: React.PropTypes.object.isRequired,
    presents: React.PropTypes.array.isRequired
  },

  render() {
    return (
      <div>
        <div className="ui horizontal divider">
          <User user={this.props.user} />
        </div>

        {this.props.presents.length ? this.props.presents.map((present) => (
          <Present key={present._id} present={present} />
        )) : <span>No presents!</span>}

      </div>
    )
  }
});