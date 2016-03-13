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

    return (
      <div
        data-user-id={this.props.user._id}
        className="user-presents">

        <PresentPopup
          forUserId={this.props.user._id}
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
          {this.props.presents.length ? this.props.presents.map((present) => (
            <Present key={present._id} present={present} />
          )) : (
            <div className="no-results">
              <i className="huge gift icon" />
              <br />
              <T>No presents</T>
            </div>
          )}
        </VerticalSlideToggle>
      </div>
    );
  }
});