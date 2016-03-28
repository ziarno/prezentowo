import React from 'react'

LoginOrRegisterButton = () => (
  <div className="ui buttons compact">
    <a href="/sign-in" className="ui button">
      <i className="sign in icon"></i>
      <T>Login</T>
    </a>
    <a href="/sign-up" className="ui button">
      <i className="user icon"></i>
      <T>Register</T>
    </a>
  </div>
)