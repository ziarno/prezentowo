import React from 'react'
import {PopupComponent, ValidatedInput} from '../../../../lib/Mixins'
import {getPresentImages} from '../../../../lib/utilities'
import {createContainer} from 'meteor/react-meteor-data'

PresentPopup = class PresentPopup extends PopupComponent {

  constructor(props) {
    super(props)
    this.schema = Presents.Schemas.NewPresent
        .pick([
          'title',
          'picture',
          'picture.small',
          'picture.large',
          'description',
          'forUserId'
        ])
        .namedContext('newPresent')
    this.hideAndReset = this.hideAndReset.bind(this)
    this.reset = this.reset.bind(this)
    this.addPresent = this.addPresent.bind(this)
    this.editPresent = this.editPresent.bind(this)
    this.removePresent = this.removePresent.bind(this)
    this.submitPresent = this.submitPresent.bind(this)
    this.getPopupSettings = this.getPopupSettings.bind(this)
  }

  getPopupSettings() {
    var position = 'bottom center'
    return {
      onShow: () => {
        this.schema.resetValidation()
      },
      position,
      lastResort: position
    }
  }

  addPresent(presentData) {
    this.hideAndReset()
    Presents.methods.createPresent.call({
      eventId: Session.get('event')._id,
      ...presentData
    })
  }

  editPresent(presentData) {
    this.hidePopup(() => {
      Presents.methods.editPresent.call({
        _id: this.props.present._id,
        ...presentData
      })
      this.reset()
    })
  }

  removePresent() {
    var {onRemove} = this.props
    var {_id: presentId} = this.props.present

    if (_.isFunction(onRemove)) {
      onRemove.call(this, presentId)
    }
    this.hideAndReset(() => {
      Presents.methods.removePresent.call({
        presentId
      })
    })
  }

  submitPresent(presentData) {
    if (this.isEdit()) {
      this.editPresent(presentData)
    } else {
      this.addPresent(presentData)
    }
  }

  isEdit() {
    return !!this.props.present
  }

  shouldComponentUpdate(newProps, newState) {
    return !_.isEqual(this.props, newProps) ||
      !_.isEqual(newState, this.state)
  }

  renderTrigger() {
    return (
      <div
        ref="popupTrigger"
        onClick={this.showPopup}
        className={classNames(this.props.buttonClassName,
          'present-button',
          'ui icon button',
          'waves-effect waves-button')}>
        {this.props.icon}
        <T>{this.props.buttonText}</T>
      </div>
    )
  }

  renderPopup() {
    var {defaultSelectedUser, users} = this.props
    var isEdit = this.isEdit()
    var title = `${isEdit ? 'Edit' : 'New'} present`
    var defaultSelectedUserId = !this.props.present &&
      defaultSelectedUser ? defaultSelectedUser._id : ''
    var forUser = users &&
      users.length > 0 &&
      users[0]
    var ForUser

    //set ForUser
    if (!forUser) {
      ForUser = null
    } else if (users.length === 1) {
      ForUser = (
        <ValidatedInput
          name="forUserId"
          staticValue={users[0]._id}>
          <User user={users[0]} />
        </ValidatedInput>
      )
    } else if (users.length > 1) {
      ForUser = (
        <SelectInput
          inline
          className="scrolling"
          placeholder="choose user"
          selectDefault={defaultSelectedUserId}
          name="forUserId">
          {users.map((user) => (
            <div
              className="item"
              key={user._id}
              data-value={user._id}>
              <User user={user} />
            </div>
          ))}
        </SelectInput>
      )
    }

    return (
      <div
        ref="popupTarget"
        className={classNames(
          'present-popup form-popup ui flowing popup',
          this.props.popupClassName
        )}>
        <Form
          ref="form"
          data={this.props.present}
          onSubmit={this.submitPresent}
          schema={this.schema}>

          <div className="ui attached message">
            <div className="header">
              <T>{title}</T>
              {ForUser ? (
                <T>for</T>
              ) : null}
              {ForUser}
            </div>
          </div>

          <div
            className="form-popup--form flex ui form attached fluid segment">
            <ImagePicker
              name="picture"
              images={getPresentImages()}
              randomizeInitialImage
              uploadOptions={{
                folder: 'presents',
                transformation: 'large'
              }}
              responseTransformations={['small', 'large']}
            />
            <div className="form-popup--form-right" >
              <Input
                ref="autofocus"
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
            showRemove={isEdit}
            acceptButtonText={isEdit ? 'Save' : 'Add present'}
            onRemove={this.removePresent}
            onCancel={this.hideAndReset}
          />

        </Form>
      </div>
    )
  }

}

PresentPopup.propTypes = {
  present: React.PropTypes.object,
  defaultSelectedUser: React.PropTypes.object,
  users: React.PropTypes.array,
  buttonClassName: React.PropTypes.string,
  buttonText: React.PropTypes.string,
  popupClassName: React.PropTypes.string,
  icon: React.PropTypes.element,
  onRemove: React.PropTypes.func
}

PresentPopup = createContainer(() => {
  return {
    defaultSelectedUser: Session.get('currentUser')
  }
}, PresentPopup)