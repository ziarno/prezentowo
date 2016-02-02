ModalManager = function () {

  var isModalOpen, $modalContainer, modalContainer;

  return {

    init() {
      isModalOpen = false;
      $modalContainer = $('<div id="modal-container"></div>');
      $modalContainer
        .on('hidden.bs.modal', this.onHidden)
        .on('show.bs.modal', function () {
          Waves.attach('.btn:not(.waves-effect)');
        })
        .appendTo(document.body);
      modalContainer = $modalContainer[0];
    },

    open(modalComponent) {
      if (isModalOpen) {
        throw new Error('Modal already opened');
      }
      isModalOpen = true;
      ReactDOM.render(modalComponent, modalContainer);
    },

    close() {
      if (!isModalOpen) {
        throw new Error('No modal open');
      }
      $modalContainer.find('.modal').modal('hide');
    },

    onHidden() {
      isModalOpen = false;
      ReactDOM.unmountComponentAtNode(modalContainer);
    }
  };

}();