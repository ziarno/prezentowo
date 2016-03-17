import {attachWaves} from '../../../lib/utilities';

ModalManager = function () {

  var $modal;
  var modalContainer;

  return {

    init() {
      modalContainer = document.createElement('div');
      modalContainer.id = 'modal-container';
      //make modal render into the same container that it normally would without detachable:false
      modalContainer.className =
        'ui dimmer modals';
      document.body.appendChild(modalContainer);
    },

    open(modalComponent) {
      $modal = $(ReactDOM.findDOMNode(
        ReactDOM.render(modalComponent, modalContainer)
      ));
      $modal.modal({
        //note: don't use detachable:false - instead "detach" into the same container that we render it into
        autofocus: false,
        onShow: attachWaves,
        onHidden() {
          ReactDOM.unmountComponentAtNode(modalContainer);
        }
      });
      $modal.modal('show');
    },

    close() {
      $modal && $modal.modal('hide');
    }
  };

}();