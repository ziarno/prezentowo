import React from 'react'
import reactMixin from 'react-mixin'
import ReactAutolink from 'react-autolink'
import ReactEmoji from 'react-emoji'

ParsedText = class ParsedText extends React.Component {

  render() {
    var {className, text} = this.props
    var autolinkOptions = {
      target: '_blank',
      className: 'outside-link',
      //note: react-autolink package is not
      //providing it's own key to <a> tags by itself
      get key() {
        return _.uniqueId()
      }
    }
    var emojifyOptions = {
      emojiType: 'emojione'
    }

    return (
      <div className={className}>
        {text ? text.split('\n').map((line, index) => {
          return (
            <p key={index}>
              {this
                .autolink(line, autolinkOptions)
                .map(el => (
                  _.isString(el) ?
                    this.emojify(el, emojifyOptions) :
                    el
                ))
              }
            </p>
          )
        }) : null}
      </div>
    )
  }
}

ParsedText.propTypes = {
  className: React.PropTypes.string,
  text: React.PropTypes.string
}

reactMixin(ParsedText.prototype, ReactAutolink)
reactMixin(ParsedText.prototype, ReactEmoji)
