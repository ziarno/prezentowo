SimpleModal = React.createClass({
  close() {
    var modal = ReactDOM.findDOMNode(this);
    $(modal).modal('hide');
  },
  render() {
    return (
      <Modal>
        <span>lalala</span>
        <button onClick={this.close}>close</button>
      </Modal>
    )
  }
});