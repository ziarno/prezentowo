import React from 'react'
import ReactDOM from 'react-dom'

Lightbox = class Lightbox extends React.Component {

  constructor() {
    super()

  }

  render() {

    var {picture} = this.props

    return (
      <Modal>
        <Img
          autosize
          onLoad={(image) => {
            //$(ReactDOM.findDOMNode(this)).width(image.width)
            ModalManager.refresh()
          }}
          src={picture} />
      </Modal>
    )
  }

}