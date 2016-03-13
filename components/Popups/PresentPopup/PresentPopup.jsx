import {Popup} from '../../../lib/Mixins';

PresentPopup = React.createClass({

  mixins: [ReactMeteorData, Popup],

  propTypes: {
    forUserId: React.PropTypes.string
  },

  getMeteorData() {
    this.schema = this.schema || Presents.Schemas.NewPresent
      .pick(['title', 'pictureUrl', 'description'])
      .namedContext('newPresent');

    return {
      errors: this.schema.invalidKeys()
    };
  },

  contextTypes: {
    eventId: React.PropTypes.string
  },

  getPopupSettings() {
    return {
      onHide: () => this.schema.resetValidation()
    };
  },

  reset() {
    this.refs.form.reset();
  },

  hideAndReset() {
    this.hidePopup(this.reset);
  },

  addPresent(presentData) {
    if (this.schema.validate(presentData)) {
      this.hideAndReset();
      console.time('rerender');
      console.time('method');
      Presents.methods.createPresent.call({
        eventId: this.context.eventId,
        forUserId: this.props.forUserId,
        ...presentData
      }, (e,d) => console.timeEnd('method'));
      setTimeout(()=>console.timeEnd('rerender'));
    }
  },

  shouldComponentUpdate({forUserId}) {
    //note: very important here! otherwise a lot of unnecessary re-renders happen, and block the thread!
    return forUserId !== this.props.forUserId;
  },

  render() {

    var avatars = _.range(12).map((index) => (
      `/images/avatars/m${index + 1}.png`
    ));

    var AddPresentButton = (
      <div
        ref="popupTrigger"
        className="user-presents--control-button circular ui icon button left waves-effect waves-button">
        <i className="large icons">
          <i className="gift icon"></i>
          <i className="plus corner icon"></i>
        </i>
      </div>
    );

    var Popup = (
      <div
        ref="popup"
        className="ui flowing popup form-popup">

        <div className="ui attached message">
          <div className="header">
            <T>New present</T>
          </div>
        </div>

        <Form
          ref="form"
          className="form-popup--form attached fluid segment"
          onSubmit={this.addPresent}
          schema={this.schema}>
          <ImagePicker
            name="pictureUrl"
            images={avatars}
          />
          <div className="form-popup--form-right" >
            <Input
              name="title"
              placeholder={_i18n.__('Title')}
            />
            <Input
              name="description"
              placeholder={_i18n.__('Description')}
              type="textarea"
              rows={7}
            />
          </div>
        </Form>

        <FormErrorMessage schema={this.schema} />

        <div className="ui bottom attached message actions">
          <div className="ui buttons">
            <button
              className="ui labeled icon button"
              onClick={this.hideAndReset}>
              <i className="remove icon"></i>
              <T>Cancel</T>
            </button>
            <button
              className="ui labeled icon primary button"
              disabled={!this.schema.isValid()}
              onClick={(e) => this.refs.form.submit(e)}>
              <i className="checkmark icon"></i>
              <T>Add present</T>
            </button>
          </div>
        </div>

      </div>
    );

    return (
      <div>
        {AddPresentButton}
        {Popup}
      </div>
    );

  }
});