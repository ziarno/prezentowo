import React from 'react'
import _ from 'underscore'
import { classNames } from 'meteor/maxharris9:classnames'
import { ValidatedInput } from '../../../lib/Mixins'

EventTypeInput = class EventTypeInput extends ValidatedInput {

  constructor(props) {
    super(props)
    this.state = _.extend(this.state, {
      type: null
    })
    this.reset = this.reset.bind(this)
    this.getValue = this.getValue.bind(this)
    this.setValue = this.setValue.bind(this)
    this.setType = this.setType.bind(this)
  }

  reset() {
    this.setState({
      type: null
    })
  }

  getValue() {
    return this.state.type
  }

  setValue(type) {
    this.setState({type})
  }

  setType(type) {
    this.validate(type)
    this.setState({type})
  }

  getButton(type) {
    const isManyToMany = type === 'many-to-many'

    return (
      <div
        id={type}
        type="button"
        onClick={() => this.setType(type)}
        className={classNames('ui button', {
          disabled: this.isDisabled(),
          active: this.state.type === type
        })}
      >
        <div>
          <i className="large users icon" />
          <i
            className={classNames('large', {
              exchange: isManyToMany,
              'long arrow right': !isManyToMany
            }, 'icon')}
          />
          <i
            className={classNames('large', {
              users: isManyToMany,
              user: !isManyToMany
            }, 'icon')}
          />
        </div>
        <p>
          {isManyToMany ? (
            <T>Many to Many</T>
          ) : (
            <T>Many to One</T>
          )}
        </p>
      </div>
    )
  }

  render() {
    return (
      <div className={classNames('ui field', {
        error: this.shouldShowError()
      })}>

        <label>
          <T>Type</T>
        </label>

        {this.getButton('many-to-many')}
        <p className="hint">
          <T>hints.Christmas</T>
        </p>

        {this.getButton('many-to-one')}
        <p className="hint">
          <T>hints.Birthday</T>
        </p>

      </div>
    )
  }
}
