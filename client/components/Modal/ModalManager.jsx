import React from 'react'
import ReactDOM from 'react-dom'

ModalManager = function () {

  var modals = {}

  function invokeModalById(id, func) {
    if (_.isString(id) && modals[id]) {
      func(modals[id], id)
    } else {
      _.forEach(modals, function (modal, key) {
        func(modal, key)
      })
    }
  }

  return {

    createModal({id = 'modal-container', className, modalComponent}) {
      //trick: make modal render into the same container
      //that it normally would without detachable:false
      var container = document.getElementById(id) ||
        document.createElement('div')
      var modal

      container.id = id
      container.className = `${className} ui dimmer modals`
      document.body.appendChild(container)

      modal = ReactDOM.findDOMNode(
        ReactDOM.render(modalComponent, container)
      )

      return modals[id] = {modal, container}
    },

    open(modalComponent, options = {}) {
      var {id} = options
      var {modal} =
        ModalManager.createModal({
          ...options,
          modalComponent
        })
      var $modal = $(modal)

      $modal.modal({
        //note: don't use detachable:false - instead "detach" into the same container that we render it into
        context: `#${id}`,
        autofocus: false,
        onHidden() {
          ModalManager.destroy(id)
        }
      })
      $modal.modal('show')
    },

    destroy(id) {
      invokeModalById(id, ({container}, modalId) => {
        ReactDOM.unmountComponentAtNode(container)
        delete modals[modalId]
      })
    },

    close(id) {
      invokeModalById(id, ({modal}) => {
        $(modal).modal('hide')
      })
    },

    refresh(id) {
      invokeModalById(id, ({modal}) => {
        $(modal).modal('refresh')
      })
    }
  }

}()