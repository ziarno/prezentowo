import React from 'react'
import {createContainer} from 'meteor/react-meteor-data'

Chat = class Chat extends React.Component {

  constructor() {
    super()
    this.onMessageSubmit = this.onMessageSubmit.bind(this)
  }

  /**
   * Combines comments from the same user in a row
   * {
   *    user: Object, (from collection: Participants)
   *    messages: Array of Strings
   * }
   */
  static getGroupedComments(comments, participants) {
    var groupedComments = []

    function makeGroup(comment) {
      groupedComments.push({
        user: _.find(participants, p => p._id === comment.creatorId),
        comments: [comment]
      })
    }

    function pushCommentToLastGroup(comment) {
      _.last(groupedComments).comments.push(comment)
    }

    _.reduce(comments, (previousCreatorId, comment) => {
      if (previousCreatorId &&
          previousCreatorId === comment.creatorId) {
        pushCommentToLastGroup(comment)
      } else {
        makeGroup(comment)
      }
      return comment.creatorId
    }, null)

    return groupedComments
  }

  onMessageSubmit({message}) {
    var {onMessageSubmit} = this.props

    if (!message) {
      return
    }

    this.refs.form.reset()
    if (_.isFunction(onMessageSubmit)) {
      onMessageSubmit(message)
    }
  }

  componentDidMount() {
    this.refs.comments.scrollTop = 1e6
  }

  componentDidUpdate() {
    this.refs.comments.scrollTop = 1e6
  }

  render() {
    var {comments, participants, title, titleEl, loading} = this.props
    var groupedComments =
      Chat.getGroupedComments(comments, participants)
    var isEmpty = !comments || comments.length === 0

    return (
      <div className={classNames('chat', this.props.className)}>
        {title ? (
          <h3 className="ui dividing header">
            <T>{title}</T>
          </h3>
        ) : null}
        {titleEl || null}
        <div
          ref="comments"
          className="comments">
          {groupedComments.map(commentGroup => (
            <CommentGroup
              key={commentGroup.comments[0]._id}
              {...commentGroup}
            />
          ))}
          <Loader inverted visible={!!loading} />
          {isEmpty ? (
            <i className="empty-icon comments icon" />
          ) : null}
        </div>
        <Form
          ref="form"
          disabled={this.props.disabled}
          onSubmit={this.onMessageSubmit}>
          <Input
            name="message"
            size="small"
            placeholder="Message"
            button={(
              <button
                type="button"
                onClick={() => this.refs.form.submitForm()}
                className="ui left labeled icon button
                  waves-effect waves-button">
                <i className="send outline icon" />
                <T>Send</T>
              </button>
            )}
          />
        </Form>

      </div>
    )
  }

}

Chat.propTypes = {
  comments: React.PropTypes.array,
  title: React.PropTypes.string,
  titleEl: React.PropTypes.element,
  className: React.PropTypes.string,
  disabled: React.PropTypes.bool,
  loading: React.PropTypes.bool,
  onMessageSubmit: React.PropTypes.func
}

Chat = createContainer(() => {
  return {
    participants: Participants.find().fetch()
  }
}, Chat)