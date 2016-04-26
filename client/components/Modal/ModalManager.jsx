import React from 'react'
import ReactDOM from 'react-dom'

ModalManager = function () {

  var $modal
  var modalContainer
  var containerClassName = 'ui dimmer modals inverted'

  return {

    createContainer() {
      modalContainer = document.createElement('div')
      modalContainer.id = 'modal-container'
      //trick: make modal render into the same container that it normally would without detachable:false
      modalContainer.className = containerClassName
      document.body.appendChild(modalContainer)
    },

    open(modalComponent, options = {}) {
      var {className} = options

      modalContainer.className = [
        containerClassName,
        className
      ].join(' ')

      $modal = $(ReactDOM.findDOMNode(
        ReactDOM.render(modalComponent, modalContainer)
      ))
      $modal.modal({
        //note: don't use detachable:false - instead "detach" into the same container that we render it into
        autofocus: false,
        onHidden() {
          ReactDOM.unmountComponentAtNode(modalContainer)
          $modal = null
        }
      })
      $modal.modal('show')
    },

    close() {
      $modal && $modal.modal('hide')
    },

    refresh() {
      $modal && $modal.modal('refresh')
    }
  }

}()