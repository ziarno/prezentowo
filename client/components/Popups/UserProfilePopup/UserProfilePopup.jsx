import React from 'react'
import {PopupComponent} from '../../../../lib/Mixins'
import {createContainer} from 'meteor/react-meteor-data'
import {getAvatarImages} from '../../../../lib/utilities'

UserProfilePopup = class UserProfilePopup extends PopupComponent {

  constructor(props) {
    super(props)
    this.state = {
      images: getAvatarImages(props.user.profile.gender)
    }
    this.schema = new SimpleSchema({
      profile: {
        type: Users.Schemas.Profile
      },
      settings: {
        type: Users.Schemas.Settings
      },
      email: {
        type: String,
        regEx: SimpleSchema.RegEx.Email
      }
      }).namedContext('userProfile')
    this.getPopupSettings = this.getPopupSettings.bind(this)
    this.mapDataToForm = this.mapDataToForm.bind(this)
    this.saveUser = this.saveUser.bind(this)
    this.logout = this.logout.bind(this)
  }

  getPopupSettings() {
    var position = 'bottom right'
    return {
      onShow: () => {
        this.schema.resetValidation()
      },
      position,
      lastResort: position,
      transition: 'slide down'
    }
  }

  saveUser(data) {
    Users.methods.saveUserProfile.call(data)
    this.hideAndReset()
  }

  logout() {
    this.hideAndReset(AccountsTemplates.logout)
  }

  mapDataToForm(user = this.props.user) {
    return _.omit({
      ...user,
      email: user.registered_emails[0].address
    }, 'registered_emails', 'emails')
  }

  renderTrigger() {
    var {user} = this.props
    var pictureBackground = {
      backgroundImage: `url(${user && user.profile.pictureUrl})`
    }

    return (
      <div
        ref="popupTrigger"
        onClick={this.showPopup}
        style={pictureBackground}
        className={classNames(
          'user-profile-button ui button capitalize',
          'waves-effect waves-buton',
          this.props.buttonClassName
        )}>
        <span>{user && user.profile.name}</span>
      </div>
    )
  }

  renderPopup() {
    return (
      <div
        ref="popupTarget"
        className={classNames(
          'form-popup user-profile-popup ui flowing popup',
          this.props.popupClassName
        )}>
        <Form
          ref="form"
          data={this.mapDataToForm()}
          flattenData
          onSubmit={this.saveUser}
          schema={this.schema}>

          <div
            className="form-popup--title with-button ui attached message">
            <div
              className="header">
              <T>Your profile</T>
              <button
                type="button"
                onClick={this.logout}
                className="ui compact icon right labeled button">
                <i className="sign out icon"></i>
                <T>Logout</T>
              </button>
            </div>
          </div>

          <div
            className="form-popup--form flex ui form attached fluid segment">
            <ImagePicker
              name="profile.pictureUrl"
              images={this.state.images}
              uploadOptions={{
                folder: 'users',
                transformation: 'avatar-large'
              }}
            />
            <div className="form-popup--form-right" >
              <Input
                name="profile.name"
                placeholder="Fullname"
              />
              <Input
                name="email"
                placeholder="Email"
                type="email">
              </Input>
              <SelectInput
                placeholder="Gender"
                name="profile.gender"
                onChange={({gender}) =>
                  this.setState({images: getAvatarImages(gender)})
                }>
                <div className="item" data-value="male">
                  <i className="man icon"></i>
                  <T>Male</T>
                </div>
                <div className="item" data-value="female">
                  <i className="woman icon"></i>
                  <T>Female</T>
                </div>
              </SelectInput>
            </div>

            <div
              className="user-settings form-popup--form-right">
              <div className="ui field">
                <label>
                  <T>Participants view mode</T>
                </label>
                <RadioButtons
                  name="settings.viewMode.participantsMode">
                  <button
                    type="button"
                    className="ui left labeled icon button"
                    data-value="single">
                    <T>Single</T>
                    <i className="user icon" />
                  </button>
                  <button
                    type="button"
                    className="ui left labeled icon button"
                    data-value="multi">
                    <T>Multi</T>
                    <i className="users icon" />
                  </button>
                </RadioButtons>
              </div>
              <div className="ui field">
                <label>
                  <T>Presents view mode</T>
                </label>
                <RadioButtons
                  name="settings.viewMode.presentMode">
                  <button
                    type="button"
                    className="ui left labeled icon button"
                    data-value="full-width">
                    <T>Full width</T>
                    <i className="list layout icon" />
                  </button>
                  <button
                    type="button"
                    className="ui left labeled icon button"
                    data-value="card">
                    <T>Card</T>
                    <i className="grid layout icon" />
                  </button>
                </RadioButtons>
              </div>
              <a
                onClick={this.hidePopup}
                href="/change-password">
                <T>Change password</T>
              </a>
            </div>
          </div>

          <FormErrorMessage />

          <FormActionButtons
            acceptButtonText="Save"
            onCancel={this.hideAndReset}
          />

        </Form>

      </div>
    )
  }

}

UserProfilePopup.propTypes = {
  buttonClassName: React.PropTypes.string,
  popupClassName: React.PropTypes.string
}

UserProfilePopup = createContainer(() => {
  return {
    user: Meteor.user()
  }
}, UserProfilePopup)