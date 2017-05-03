import React from 'react'
import ReactDOM from 'react-dom'
import _ from 'underscore'
import { $ } from 'meteor/jquery'

ModalManager = (function () {

  const modals = {}

  function invokeModalById(id, func) {
    if (_.isString(id) && modals[id]) {
      return func(modals[id], id)
    } else {
      return _.map(modals, function (modal, key) {
        return func(modal, key)
      })
    }
  }

  return {

    createModal({
        id = 'modal-container',
        className = '',
        modalComponent
      }) {
      const container = document.getElementById(id) ||
        document.createElement('div')
      let modal

      container.id = id
      container.className = `${className} ui dimmer modals`
      document.body.appendChild(container)

      modal = ReactDOM.findDOMNode(
        ReactDOM.render(modalComponent, container)
      )

      modals[id] = { modal, container }
      return modals[id]
    },

    render(modalComponent, containerId) {
      ReactDOM.render(
        modalComponent,
        document.getElementById(containerId)
      )
    },

    open(modalComponent, options = {}) {
      if (ModalManager.isOpen(options.id)) {
        ModalManager.destroy(options.id)
      }
      const { id } = options
      const { modal } =
        ModalManager.createModal({
          ...options,
          modalComponent
        })
      const $modal = $(modal)

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

    isOpen(id) {
      return id ? !!modals[id] : !_.isEmpty(modals)
    },

    destroy(id) {
      invokeModalById(id, ({container}, modalId) => {
        ReactDOM.unmountComponentAtNode(container)
        document.body.removeChild(container)
        delete modals[modalId]
      })
      //if we close a modal the 'dimmed' class is removed,
      //so we must bring it back if there are more modals
      //opened
      $(document.body)
        .toggleClass('dimmed', !_.isEmpty(modals))
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

})()
