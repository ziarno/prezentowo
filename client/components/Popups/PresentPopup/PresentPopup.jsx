import {Popup, Autorun} from '../../../../lib/Mixins'
import reactMixin from 'react-mixin'

PresentPopup = class PresentPopup extends React.Component {

  constructor() {
    super()
    this.schema = Presents.Schemas.NewPresent
        .pick(['title', 'pictureUrl', 'description', 'forUserId'])
        .namedContext('newPresent')
    this.state = {
      defaultSelectedUser: Session.get('currentUser')
    }
    this.avatars = _.range(20).map((index) => (
      `/images/presents/p${index + 1}-150px.png`
    ))
    this.hideAndReset = this.hideAndReset.bind(this)
    this.reset = this.reset.bind(this)
    this.addPresent = this.addPresent.bind(this)
    this.autorunSetDefaultSelectedUser = this.autorunSetDefaultSelectedUser.bind(this)
    this.getPopupSettings = this.getPopupSettings.bind(this)
  }

  getPopupSettings() {
    return {
      onShow: () => {this.schema.resetValidation()},
      position: 'top right',
      lastResort: 'top right',
      movePopup: false,
      offset: -13
    }
  }

  autorunSetDefaultSelectedUser() {
    this.setState({
      defaultSelectedUser: Session.get('currentUser')
    })
  }

  reset() {
    this.refs.form.reset()
  }

  hideAndReset() {
    this.hidePopup(this.reset)
  }

  addPresent(presentData) {
    if (this.schema.validate(presentData)) {
      this.hideAndReset()
      Presents.methods.createPresent.call({
        eventId: FlowRouter.getParam('eventId'),
        ...presentData
      })
    }
  }

  //shouldComponentUpdate({users, selectedDefaultUser}) {
  //  return user._id !== this.props.user._id
  //}

  render() {

    var defaultSelectedUserId = this.state.defaultSelectedUser &&
      this.state.defaultSelectedUser._id

    var Button = (
      <div
        ref="popupTrigger"
        className={classNames('present-button present-button--add ' +
          'circular ui icon primary button left ' +
          'waves-effect waves-button',
          this.props.buttonClassName)}>
        <i className="large icons">
          <i className="plus icon"></i>
          <i className="gift corner inverted icon"></i>
        </i>
      </div>
    )

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
                placeholder="choose user"
                selectDefault={defaultSelectedUserId}
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
            className="form-popup--form flex ui form attached fluid segment">
            <ImagePicker
              name="pictureUrl"
              images={this.avatars}
              randomizeInitialImage
              uploadOptions={{
                folder: 'presents'
              }}
            />
            <div className="form-popup--form-right" >
              <Input
                name="title"
                placeholder="Title"
              />
              <Input
                name="description"
                placeholder="Description (optional)"
                type="textarea"
                rows={6}
              />
            </div>
          </div>

          <FormErrorMessage schema={this.schema} />

          <div className="ui bottom attached message actions">
            <div className="ui buttons">
              <div
                className="ui labeled icon button"
                onClick={this.hideAndReset}>
                <i className="remove icon"></i>
                <T>Cancel</T>
              </div>
              <div
                className="ui labeled icon primary button"
                onClick={(e) => this.refs.form.submitForm(e)}>
                <i className="checkmark icon"></i>
                <T>Add present</T>
              </div>
            </div>
          </div>

        </Form>
      </div>
    )

    return (
      <div className={this.props.wrapperClassName}>
        {Button}
        {Popup}
      </div>
    )

  }

}

PresentPopup.propTypes = {
  users: React.PropTypes.array,
  wrapperClassName: React.PropTypes.string,
  buttonClassName: React.PropTypes.string
}
PresentPopup.contextTypes = {
  eventId: React.PropTypes.string
}

reactMixin(PresentPopup.prototype, Popup)
reactMixin(PresentPopup.prototype, Autorun)