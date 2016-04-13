import React from 'react'
import {createContainer} from 'meteor/react-meteor-data'

SearchableInput = class SearchableInput extends Input {

  constructor(props) {
    super(props)
    this.search = this.search.bind(this)
  }

  search() {
    this.props.search.search(this.getValue())
  }

  componentWillReceiveProps(newProps) {
    var previousStatus = this.props.status
    var nextStatus = newProps.status

    if (previousStatus.loading && nextStatus.loaded) {
      $(this.refs.dropdown).dropdown('show')
    }
  }

  componentDidMount() {
    super.componentDidMount()
    $(this.refs.dropdown).dropdown({
      action: 'hide'
    })
  }

  render() {

    return (
      <div
        className={classNames('ui field searchable-input', this.props.className, {
          error: this.shouldShowError()
        })}>

        {this.props.label ? (
          <label>
            <T>{this.props.label}</T>
          </label>
        ) : null}

        <div
          ref="dropdown"
          className="ui fluid scrolling dropdown">
          <div className="menu">
            {this.props.results.length ? this.props.results.map((user) => (
              <div
                key={user._id}
                className="item"
                onClick={() => this.props.onSearchSelect(user)}>
                <User user={user} className="item" />
              </div>
            )) : (
              <div className="message">
                <T>No results</T>
              </div>
            )}
          </div>
        </div>

        <div
          className={classNames('ui action input', {
            error: this.shouldShowError()
          })}>
          <input
            ref="input"
            placeholder={_i18n.__(this.props.placeholder)}
            onFocus={this.hideError}
            onBlur={(e) => this.validate(e.currentTarget.value)}
            onChange={(e) => this.onInputChange(e.currentTarget.value)}
            type="text"
            name={this.props.name}
          />

          <button
            ref="search"
            type="button"
            className={classNames('ui icon button', {
              loading: this.props.status.loading
            })}
            onClick={this.search}>
            <i className="small search icon"></i>
          </button>
        </div>

        {this.props.hint ? (
          <T className="hint">{this.props.hint}</T>
        ) : null}

      </div>
    )
  }
}

SearchableInput.propTypes = {
  label: React.PropTypes.string,
  hint: React.PropTypes.string,
  className: React.PropTypes.string,
  placeholder: React.PropTypes.string,
  search: React.PropTypes.object.isRequired,
  onSearchSelect: React.PropTypes.func.isRequired
}

SearchableInput = createContainer(({search}) => {
  return {
    results: search.getData(),
    status: search.getStatus()
  }
}, SearchableInput)