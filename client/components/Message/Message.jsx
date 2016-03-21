Message = class Message extends React.Component {

  constructor() {
    super()
    this.state = {
      hidden: false
    }
  }

  close() {
    this.setState({
      hidden: true
    })
  }

  render() {
    var key = 0

    return (
      <div
        className={classNames('ui message', this.props.className, {
          hidden: this.state.hidden || this.props.hidden
        })}>

        {this.props.closable ? (
          <i className="close icon"
             onClick={this.close}>
          </i>
        ) : null}

        {this.props.title ? (
          <div className="header">
            {this.props.title}
          </div>
        ) : null}

        {this.props.icon ? (
          <i className={classNames(this.props.icon, 'icon')}/>
        ) : null}

        {this.props.message ? (
          <p>{this.props.message}</p>
        ) : null}

        {this.props.messages && this.props.messages.length ? (
          <ul className="list">
            {this.props.messages.map((message) => (
              <li key={key++}>{message}</li>
            ))}
          </ul>
        ) : null}

      </div>
    )
  }

}

Message.propTypes = {
  title: React.PropTypes.string,
  type: React.PropTypes.string,
  closable: React.PropTypes.bool,
  hidden: React.PropTypes.bool,
  message: React.PropTypes.string,
  messages: React.PropTypes.array
}