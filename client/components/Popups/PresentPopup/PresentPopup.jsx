import {Popup} from '../../../../lib/Mixins';

PresentPopup = React.createClass({

  mixins: [Popup],

  propTypes: {
    users: React.PropTypes.array,
    className: React.PropTypes.string
  },

  contextTypes: {
    eventId: React.PropTypes.string
  },

  getPopupSettings() {
    return {
      //popupRefName: 'formPopup',
      onHide: () => this.schema.resetValidation(),
      position: 'top right',
      lastResort: 'top right',
      movePopup: false,
      offset: -13
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
        ...presentData
      });
    }
  },

  //shouldComponentUpdate({users, selectedDefaultUser}) {
  //  return user._id !== this.props.user._id;
  //},

  render() {
    this.schema = this.schema || Presents.Schemas.NewPresent
        .pick(['title', 'pictureUrl', 'description', 'forUserId'])
        .namedContext('newPresent');

    var avatars = _.range(20).map((index) => (
      `/images/presents/p${index + 1}-150px.png`
    ));

    var Button = (
      <div
        ref="popupTrigger"
        className="present-button present-button--add
          circular ui icon primary button left
          waves-effect waves-button">
        <i className="large icons">
          <i className="plus icon"></i>
          <i className="gift corner inverted icon"></i>
        </i>
      </div>
    );

    var Popup = (
      <div
        ref="popup"
        className="present-popup form-popup ui flowing popup">
        <Form
          ref="form"
          onSubmit={this.addPresent}
          schema={this.schema}>

          <div className="ui attached message">
            <div className="header">
              <T>New present</T>
              <T>for</T>
              <SelectInput
                inline
                className="scrolling"
                placeholder={_i18n.__('choose user')}
                name="forUserId">
                {this.props.users.map((user) => (
                  <div
                    className="item"
                    key={user._id}
                    data-value={user._id}>
                    <User user={user} />
                  </div>
                ))}
              </SelectInput>
            </div>

          </div>

          <div
            className="form-popup--form ui form attached fluid segment">
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
                rows={6}
              />
            </div>
          </div>

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

        </Form>
      </div>
    );

    return (
      <div className={this.props.className}>
        {Button}
        {Popup}
      </div>
    );

  }
});