ModalManager = function () {

  var $modal;
  var modalContainer;

  return {

    init() {
      modalContainer = document.createElement('div');
      modalContainer.id = 'modal-container';
      document.body.appendChild(modalContainer);
    },

    open(modalComponent) {
      $modal = $(ReactDOM.findDOMNode(
        ReactDOM.render(modalComponent, modalContainer)
      ));
      $modal.modal({
        detachable: false,
        autofocus: false,
        onShow() {
          Utils.attachWaves();
        },
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