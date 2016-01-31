ModalManager = function () {

  var isModalOpen, $modalContainer, modalContainer;

  return {
    init() {
      isModalOpen = false;
      $modalContainer = $('<div id="modal-container"></div>');
      $modalContainer
        .on('hidden.bs.modal', this.onHidden)
        .appendTo(document.body);
      modalContainer = $modalContainer[0];
    },
    open(component) {
      if (isModalOpen) {
        throw new Error(_i18n.__('Modal already opened'));
      }
      isModalOpen = true;
      ReactDOM.render(component, modalContainer);
    },

    onHidden() {
      isModalOpen = false;
      ReactDOM.unmountComponentAtNode(modalContainer);
    }
  };
}();