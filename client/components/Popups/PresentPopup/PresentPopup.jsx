import {PopupComponent, Autorun} from '../../../../lib/Mixins'
import reactMixin from 'react-mixin'

PresentPopup = class PresentPopup extends PopupComponent {

  constructor(props) {
    super(props)
    this.schema = Presents.Schemas.NewPresent
        .pick(['title', 'pictureUrl', 'description', 'forUserId'])
        .namedContext('newPresent')
    this.state = _.extend(this.state, {
      defaultSelectedUser: Session.get('currentUser')
    })
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
    var position = this.isEdit() ? 'bottom center' : 'top right'
    return {
      onShow: () => {this.schema.resetValidation()},
      position,
      lastResort: position,
      movePopup: false,
      offset: !this.isEdit() && -11
    }
  }

  autorunSetDefaultSelectedUser() {
    var defaultSelectedUser = Session.get('currentUser')
    if (this.state.showPopup) {
      this.setState({defaultSelectedUser})
    }
  }

  reset() {
    this.destroyPopup()
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

  isEdit() {
    return !!this.props.present
  }

  //shouldComponentUpdate({users, selectedDefaultUser}) {
  //  return user._id !== this.props.user._id
  //}

  renderTrigger() {
    return (
      <div
        onClick={this.showPopup}
        ref="popupTrigger"
        className={classNames(this.props.buttonClassName,
          'present-button',
          'ui icon button left',
          'waves-effect waves-button')}>
        {this.props.icon}
      </div>
    )
  }

  renderPopup() {
    var defaultSelectedUserId
    if (!this.props.present &&
      this.state.defaultSelectedUser) {
      defaultSelectedUserId = this.state.defaultSelectedUser._id
    } else {
      defaultSelectedUserId = ''
    }

    return (
      <div
        ref="popupTarget"
        className="present-popup form-popup ui flowing popup">
        <Form
          ref="form"
          data={this.props.present}
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
  }

}

PresentPopup.propTypes = {
  present: React.PropTypes.object,
  users: React.PropTypes.array,
  buttonClassName: React.PropTypes.string
}

reactMixin(PresentPopup.prototype, Autorun)