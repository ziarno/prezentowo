import React from 'react'

PresentDetails = class PresentDetails extends React.Component {

  constructor() {
    super()

  }

  render() {
    var {present} = this.props

    return (
      <Modal
        ribbon
        ribbonColor={classNames({
          red: !present.isOwn
        })}
        title={present.title} >
        <div className="content">
          {present.description}
        </div>
      </Modal>
    )
  }

}

PresentDetails.propTypes = {
  present: React.PropTypes.object.isRequired
}