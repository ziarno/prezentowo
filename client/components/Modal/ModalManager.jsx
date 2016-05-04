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

    createModal({
        id = 'modal-container',
        className = '',
        modalComponent
      }) {
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

      //hack: for multiple modals to work, we must manually
      //toggle the 'dimmed' class on the body, because semantic-ui
      //checks it to display another dimmer
      $(document.body).removeClass('dimmed')

      $modal.modal({
        //note: don't use detachable:false - instead "detach"
        //into the same container that we render it into
        context: `#${id}`,
        allowMultiple: true,
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
        document.body.removeChild(container)
        delete modals[modalId]
      })
      if (!_.isEmpty(modals)) {
        //if we close a modal the 'dimmed' class is removed,
        //so we must bring it back if there are more modals
        //opened
        $(document.body).addClass('dimmed')
      }
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