Modal = React.createClass({
  
  propTypes: {
    title: React.PropTypes.string.isRequired,
    ribbon: React.PropTypes.bool
  },

  componentDidMount() {
    $(this.refs.modal).modal()
  },

  render() {
    const Title = this.props.ribbon ? (
      <Ribbon>
        <h1>{this.props.title}</h1>
        <button type="button" className="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </Ribbon>
    ) : (
      <div className="modal-header">
        <button type="button" className="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
        <h4 className="modal-title">{this.props.title}</h4>
      </div>
    );

    return (
      <div className="modal fade" tabIndex="-1" role="dialog" ref="modal">
        <div className="modal-dialog">
          <div className="modal-content">
            
            {Title}
            
            <div className="modal-body">
              {this.props.children}
            </div>
            
            <div className="modal-footer">
              <button type="button" className="btn btn-default" data-dismiss="modal">Close</button>
              <button type="button" className="btn btn-primary">Save changes</button>
            </div>
            
          </div>
        </div>
      </div>
    )
  }
});
