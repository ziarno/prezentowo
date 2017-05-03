import React, { PropTypes } from 'react'

Lightbox = ({ picture }) => (
  <Modal>
    <Img
      loaderOptions={{
        inverted: false
      }}
      autosize
      onLoad={ModalManager.refresh}
      src={picture}
    />
  </Modal>
)

Lightbox.propTypes = {
  picture: PropTypes.string
}
