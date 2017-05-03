import React from 'react'

const LoginOrRegister = () => (
  <p className="translations">
    <a href="/sign-in">
      <T>Login</T>
    </a>
    <T>or</T>
    <a href="/sign-up">
      <T>Register</T>
    </a>
    <T>to join this event</T>
  </p>
)

export default LoginOrRegister
