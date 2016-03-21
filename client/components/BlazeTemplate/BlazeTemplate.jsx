import reactMixin from 'react-mixin'

BlazeTemplate = class BlazeTemplate extends React.Component {

  renderBlaze() {
    this.removeBlaze()
    Blaze.renderWithData(
      Template[this.props.template],
      _.omit(this.props, 'template'),
      ReactDOM.findDOMNode(this)
    )
  }

  removeBlaze() {
    if (this.view) {
      Blaze.remove(this.view)
    }
  }

  getMeteorData() {
    // Ensure a re-rendering of the template if a prop changes
    if (this.view) {
      this.renderBlaze()
    }
    return this.props
  }

  componentDidMount() {
    this.renderBlaze()
  }

  componentWillUnmount() {
    this.removeBlaze()
  }

  render() {
    return <div />
  }

}

reactMixin(BlazeTemplate.prototype, ReactMeteorData)