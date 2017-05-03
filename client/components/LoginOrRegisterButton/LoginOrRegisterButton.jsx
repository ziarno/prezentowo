import React from 'react'

LoginOrRegisterButton = () => (
  <div className="ui buttons compact">
    <a href="/sign-in" className="ui button">
      <i className="sign in icon" />
      <T>Login</T>
    </a>
    <a href="/sign-up" className="ui button">
      <i className="user icon" />
      <T>Register</T>
    </a>
  </div>
)
