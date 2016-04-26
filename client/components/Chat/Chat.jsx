import React from 'react'

Chat = class Chat extends React.Component {

  constructor() {
    super()

  }

  render() {
    return (
      <div className="chat">
        <h3 className="ui dividing header">
          {this.props.title}
        </h3>
        <div className="ui comments">
          {this.props.comments && this.props.comments.map(comment => (
            <Comment
              key={comment._id}
              comment={comment}
            />
          ))}
        </div>
      </div>
    )
  }

}

Chat.propTypes = {
  comments: React.PropTypes.array,
  title: React.PropTypes.string
}