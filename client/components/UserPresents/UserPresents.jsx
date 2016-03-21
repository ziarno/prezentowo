UserPresents = class UserPresents extends React.Component {

  constructor() {
    super()
    this.setVisibleUsers = this.setVisibleUsers.bind(this)
    this.setScrollSpy = this.setScrollSpy.bind(this)
  }

  shouldComponentUpdate(newProps) {
    return !_.isEqual(newProps, this.props);
  }

  setVisibleUsers(event, ...visibleUsers) {
    var visibleUserIds = _.map(visibleUsers, user => (
      $(user).attr('data-id')
    ));

    Session.set('visibleUserIds', visibleUserIds);
  }

  setScrollSpy() {
    $(ReactDOM.findDOMNode(this))
      .find('.user')
      .scrollSpy({
        offsetTop: 100,
        offsetBottom: -100,
        throttle: 300
      });
  }

  componentDidMount() {
    this.setScrollSpy();
    $(ReactDOM.findDOMNode(this))
      .find('.user')
      .on('scrollSpy:enter scrollSpy:exit', this.setVisibleUsers);
  }

  componentWillUnmount() {
    $(ReactDOM.findDOMNode(this))
      .find('.user')
      .off('scrollSpy:enter scrollSpy:exit', this.setVisibleUsers);
  }

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
      <VerticalSlideToggle
        id={`user-presents-${this.props.user._id}`}
        className="user-presents">

        <div className="ui horizontal divider">
          <User user={this.props.user} large />
        </div>

        {ownPresents.length ? (
          <div>
            <h2>
              <T>
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
              <T>
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

      </VerticalSlideToggle>
    );
  }
}

UserPresents.propTypes = {
  user: React.PropTypes.object.isRequired,
  presents: React.PropTypes.array.isRequired
}