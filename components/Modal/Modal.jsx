Modal = React.createClass({
  
  propTypes: {
    title: React.PropTypes.string.isRequired,
    ribbon: React.PropTypes.bool
  },

  render() {
    const title = this.props.ribbon ? (
      <Ribbon>
        <h1>{this.props.title}</h1>
        <i className="close icon"></i>
      </Ribbon>
    ) : (
      <div className="header">
        <i className="close icon"></i>
        {this.props.title}
      </div>
    );

    return (
      <div className="ui modal">

        {title}

        <div className="content">
          {this.props.children}
        </div>

        <div className="actions">
          <button className="ui button">Close</button>
          <button className="ui button">Save changes</button>
        </div>
            
      </div>
    );
  }
});