UserPresents = React.createClass({

  propTypes: {
    user: React.PropTypes.object.isRequired,
    presents: React.PropTypes.array.isRequired
  },

  getInitialState() {
    return {
      presentsVisible: true
    }
  },

  shouldComponentUpdate(newProps, {presentsVisible}) {
    return !_.isEqual(newProps, this.props) ||
        presentsVisible !== this.state.presentsVisible;
  },

  onToggle(visible) {
    this.setState({presentsVisible: visible});
  },

  render() {

    var ownPresents = [];
    var otherPresents = [];

    this.props.presents.forEach((present) => {
      if (present.isOwn()) {
        ownPresents.push(present);
      } else {
        otherPresents.push(present);
      }
    });

    return (
      <div
        data-user-id={this.props.user._id}
        className="user-presents">

        <PresentPopup
          user={this.props.user}
        />

        <div
          onClick={() => this.refs.toggle.toggle()}
          className={classNames(
            'user-presents--control-button user-presents--toggle',
            'circular ui icon button right waves-effect waves-button',
            {rotated: !this.state.presentsVisible}
          )}>
          <i className="chevron up icon"></i>
        </div>

        <div className="ui horizontal divider">
          <User user={this.props.user} />
        </div>

        <VerticalSlideToggle
          onToggle={this.onToggle}
          ref="toggle">

          {ownPresents.length ? (
            <div>
              <h2>
                <T name={this.props.user.profile.name.capitalizeFirstLetter()}>
                  hints.ownPresents
                </T>
              </h2>
              <div className="ui cards presents">
                {ownPresents.map((present) => (
                  <Present key={present._id} present={present} />
                ))}
              </div>
            </div>
          ) : null}

          {otherPresents.length ? (
            <div>
              <h2>
                <T name={this.props.user.profile.name.capitalizeFirstLetter()}>
                  hints.otherPresents
                </T>
              </h2>
              <div className="ui cards presents">
                {otherPresents.map((present) => (
                  <Present key={present._id} present={present} />
                ))}
              </div>
            </div>
          ): null}

          {!this.props.presents.length ? (
            <div className="no-results">
              <i className="huge gift icon" />
              <br />
              <T>No presents</T>
            </div>
          ) : null}

        </VerticalSlideToggle>
      </div>
    );
  }
});