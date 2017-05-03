import React, { PropTypes } from 'react'
import { $ } from 'meteor/jquery'
import { _i18n } from 'meteor/universe:i18n'
import { classNames } from 'meteor/maxharris9:classnames'
import { createContainer } from 'meteor/react-meteor-data'

SearchableInput = class SearchableInput extends Input {

  constructor(props) {
    super(props)
    this.search = this.search.bind(this)
  }

  search() {
    this.props.search.search(this.getValue())
  }

  componentWillReceiveProps(newProps) {
    const previousStatus = this.props.status
    const nextStatus = newProps.status

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
    const {
      className,
      label,
      results,
      onSearchSelect,
      placeholder,
      name,
      status,
      hint,
      children,
    } = this.props

    return (
      <div
        className={classNames('ui field searchable-input', className, {
          error: this.shouldShowError()
        })}
      >

        {label ? (
          <label>
            <T>{label}</T>
          </label>
        ) : null}

        <div
          ref="dropdown"
          className="ui fluid scrolling dropdown"
        >
          <div className="menu">
            {results.length ? results.map((user) => (
              <div
                key={user._id}
                className="item"
                onClick={() => onSearchSelect(user)}
              >
                <User user={user} className="item" />
              </div>
            )) : (
              <div className="message">
                <T>No results</T>
              </div>
            )}
          </div>
        </div>

        <div className="ui action input">
          <input
            ref="input"
            placeholder={_i18n.__(placeholder)}
            onFocus={this.hideError}
            onBlur={e => this.validate(e.currentTarget.value)}
            onChange={e => this.onInputChange(e.currentTarget.value)}
            type="text"
            name={name}
            disabled={this.isDisabled()}
          />

          <button
            ref="search"
            type="button"
            className={classNames('ui icon button', {
              loading: status.loading,
              red: this.shouldShowError()
            })}
            disabled={this.isDisabled()}
            onClick={this.search}>
            <i className="small search icon" />
          </button>
        </div>

        {hint ? (
          <T className="hint">{hint}</T>
        ) : null}

        {children}

      </div>
    )
  }
}

SearchableInput.propTypes = {
  label: PropTypes.string,
  hint: PropTypes.string,
  name: PropTypes.string,
  className: PropTypes.string,
  placeholder: PropTypes.string,
  search: PropTypes.object.isRequired,
  onSearchSelect: PropTypes.func.isRequired,
  results: PropTypes.array,
  status: PropTypes.object,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(React.PropTypes.node),
    PropTypes.node
  ])
}

SearchableInput = createContainer(({search}) => {
  return {
    results: search.getData(),
    status: search.getStatus()
  }
}, SearchableInput)
