import {Popup} from '../../../lib/Mixins';

PresentPopup = React.createClass({

  mixins: [Popup],

  propTypes: {
    user: React.PropTypes.object
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
      Presents.methods.createPresent.call({
        eventId: this.context.eventId,
        forUserId: this.props.user._id,
        ...presentData
      });
    }
  },

  shouldComponentUpdate({user}) {
    //note: very important here! otherwise a lot of unnecessary re-renders happen, and block the thread!
    return user._id !== this.props.user._id;
  },

  render() {
    this.schema = this.schema || Presents.Schemas.NewPresent
        .pick(['title', 'pictureUrl', 'description'])
        .namedContext('newPresent');

    var avatars = _.range(20).map((index) => (
      `/images/presents/p${index + 1}-150px.png`
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
            <div className="form-popup--header-label">
              <T>for</T>
              <span>:&nbsp;</span>
              <User user={this.props.user} />
            </div>
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
            randomizeInitialImage
            uploadOptions={{
              folder: 'presents'
            }}
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
              onClick={(e) => this.refs.form.submitForm(e)}>
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