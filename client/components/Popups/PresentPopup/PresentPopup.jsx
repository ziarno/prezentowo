import React from 'react'
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
    this.editPresent = this.editPresent.bind(this)
    this.removePresent = this.removePresent.bind(this)
    this.autorunSetDefaultSelectedUser = this.autorunSetDefaultSelectedUser.bind(this)
    this.getPopupSettings = this.getPopupSettings.bind(this)
  }

  getPopupSettings() {
    var position = this.isEdit() ? 'bottom center' : 'top right'
    return {
      onShow: () => {
        this.autorunSetDefaultSelectedUser()
        this.schema.resetValidation()
      },
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

  addPresent(presentData) {
    if (this.schema.validate(presentData)) {
      this.hideAndReset()
      Presents.methods.createPresent.call({
        eventId: Session.get('event')._id,
        ...presentData
      })
    }
  }

  editPresent(presentData) {
    if (this.schema.validate(presentData)) {
      this.hideAndReset()
      Presents.methods.editPresent.call({
        _id: this.props.present._id,
        ...presentData
      })
    }
  }

  removePresent() {
    this.hidePopup(() => {
      Presents.methods.removePresent.call({
        presentId: this.props.present._id
      })
    })
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
          onSubmit={(presentData) => {
            if (this.isEdit()) {
              this.editPresent(presentData)
            } else {
              this.addPresent(presentData)
            }
          }}
          schema={this.schema}>

          <div className="ui attached message">
            <div className="header">
              {this.isEdit() ? (
                <T>Edit present</T>
              ) : (
                <T>New present</T>
              )}
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

          <FormErrorMessage />

          <FormActionButtons
            showRemove={this.isEdit()}
            acceptButtonText={this.isEdit() ? 'Save' : 'Add present'}
            onRemove={this.removePresent}
            onCancel={this.hideAndReset}
            onAccept={(e) => this.refs.form.submitForm(e)}
          />

        </Form>
      </div>
    )
  }

}

PresentPopup.propTypes = {
  present: React.PropTypes.object,
  users: React.PropTypes.array,
  buttonClassName: React.PropTypes.string,
  icon: React.PropTypes.element
}

reactMixin(PresentPopup.prototype, Autorun)