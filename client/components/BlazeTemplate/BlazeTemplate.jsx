import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import reactMixin from 'react-mixin'
import { Blaze } from 'meteor/blaze'
import _ from 'underscore'
import { Template } from 'meteor/templating'
import { ReactMeteorData } from 'meteor/react-meteor-data'

BlazeTemplate = class BlazeTemplate extends Component {

  renderBlaze() {
    this.removeBlaze()
    Blaze.renderWithData(
      Template[this.props.template],
      _.omit(this.props, 'template'),
      ReactDOM.findDOMNode(this)
    )
  }

  removeBlaze() {
    if (this.view) {
      Blaze.remove(this.view)
    }
  }

  getMeteorData() {
    // Ensure a re-rendering of the template if a prop changes
    if (this.view) {
      this.renderBlaze()
    }
    return this.props
  }

  componentDidMount() {
    this.renderBlaze()
  }

  componentWillUnmount() {
    this.removeBlaze()
  }

  render() {
    return <div />
  }

}

reactMixin(BlazeTemplate.prototype, ReactMeteorData)
