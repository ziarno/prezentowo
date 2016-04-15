import React from 'react'
import {PopupComponent, ValidatedInput} from '../../../../lib/Mixins'
import {getPresentImages} from '../../../../lib/utilities'
import {createContainer} from 'meteor/react-meteor-data'

PresentPopup = class PresentPopup extends PopupComponent {

  constructor(props) {
    super(props)
    this.schema = Presents.Schemas.NewPresent
        .pick(['title', 'pictureUrl', 'description', 'forUserId'])
        .namedContext('newPresent')
    this.hideAndReset = this.hideAndReset.bind(this)
    this.reset = this.reset.bind(this)
    this.addPresent = this.addPresent.bind(this)
    this.editPresent = this.editPresent.bind(this)
    this.removePresent = this.removePresent.bind(this)
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
    this.hideAndReset(() => {
      Presents.methods.removePresent.call({
        presentId: this.props.present._id
      })
    })
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
      </div>
    )
  }

  renderPopup() {
    var defaultSelectedUserId
    var title = `${this.isEdit() ? 'Edit' : 'New'} present`
    var ForUser

    //set defaultSelectedUserId
    if (!this.props.present &&
      this.props.defaultSelectedUser) {
      defaultSelectedUserId = this.props.defaultSelectedUser._id
    } else {
      defaultSelectedUserId = ''
    }

    //set ForUser
    if (!this.props.users || this.props.users.length === 0) {
      ForUser = null
    } else if (this.props.users.length === 1) {
      ForUser = (
        <ValidatedInput
          name="forUserId"
          staticValue={this.props.users[0]._id}>
          <User user={this.props.users[0]} />
        </ValidatedInput>
      )
    } else if (this.props.users.length > 1) {
      ForUser = (
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
              name="pictureUrl"
              images={getPresentImages()}
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
  popupClassName: React.PropTypes.string,
  icon: React.PropTypes.element
}

PresentPopup = createContainer(() => {
  return {
    defaultSelectedUser: Session.get('currentUser')
  }
}, PresentPopup)