import React from 'react'

Lightbox = class Lightbox extends React.Component {

  render() {
    var {picture} = this.props

    return (
      <Modal>
        <Img
          loaderOptions={{
            inverted: false
          }}
          autosize
          onLoad={ModalManager.refresh}
          src={picture} />
      </Modal>
    )
  }

}