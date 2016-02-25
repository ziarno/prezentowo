SimpleModal = React.createClass({
  render() {
    return (
      <Modal {...this.props} >
        <div className="content">
          <span>lalala</span>
        </div>
        <div className="actions">
          <button className="ui button compact">Close</button>
          <button className="ui button compact">Save changes</button>
        </div>
      </Modal>
    )
  }
});