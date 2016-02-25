Message = React.createClass({

  propTypes: {
    title: React.PropTypes.string,
    type: React.PropTypes.string,
    closable: React.PropTypes.bool,
    hidden: React.PropTypes.bool,
    message: React.PropTypes.string,
    messages: React.PropTypes.array
  },

  getInitialState() {
    return {
      hidden: false
    };
  },

  close() {
    this.setState({
      visible: true
    });
  },

  render() {
    var key = 0;

    return (
      <div className={classNames(`ui message ${this.props.type}`, {
        hidden: this.state.visible || this.props.visible
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
    );
  }
});