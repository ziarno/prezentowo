import React from 'react'
import {ValidatedInput, RefreshOnLocaleChange} from '../../../lib/Mixins'
import reactMixin from 'react-mixin'

SearchableInput = class SearchableInput extends ValidatedInput {
  
  constructor() {
    super()
    this.state = _.extend(this.getDefaultState(), {
      showSearchResults: false
    })
    this.getValue = this.getValue.bind(this)
    this.setValue = this.setValue.bind(this)
    this.search = this.search.bind(this)
    this.reset = this.reset.bind(this)
  }
  
  getMeteorData() {
    return {
      results: this.props.search && this.props.search.getData(),
      status: this.props.search && this.props.search.getStatus()
    }
  }

  getValue() {
    return this.refs.input.value
  }

  setValue(value) {
    this.refs.input = value
  }

  search() {
    console.log('search')
    this.setState({showSearchResults: true})
    this.props.search.search(this.getValue())
  }

  reset() {
    console.log('reset')
    this.setState({
      showSearchResults: false
    })
  }

  componentDidMount() {
    super.componentDidMount()
    $(this.refs.search).dropdown({
      //on: 'custom event',
      action: 'hide',
      onHide: () => this.setState({showSearchResults: false})
    })
  }

  render() {

    if (this.props.search) {
      console.log('status: ', this.data.status)
      if (this.state.showSearchResults) {
        console.log('results: ', this.data.results)
      }
    }

    return (
      <div
        className={classNames('ui field', this.props.className, {
          error: this.shouldShowError()
        })}>

        {this.props.label ? (
          <label>{this.props.label}</label>
        ) : null}

        <div className={classNames('ui input', {
          action: this.props.search
        })}>
          <input
            ref="input"
            placeholder={_i18n.__(this.props.placeholder)}
            onFocus={this.hideError}
            onBlur={(e) => this.validate(e.currentTarget.value)}
            onChange={(e) => this.onChange(e.currentTarget.value)}
            type={this.props.type || 'text'}
            name={this.props.name}
          />
          {this.props.search ? (
          <div
            ref="search"
            className={classNames('ui icon button dropdown', {
                loading: this.data.isSearching
              })}
            onClick={this.search}>
            <i className="small search icon"></i>
            <div className="menu">
              {this.data.results.map((user) => (
                <User key={user._id} user={user} className="item"></User>
              ))}
            </div>
          </div>
            ) : null}
        </div>

        {this.props.hint ? (
          <span className="hint">{_i18n.__(this.props.hint)}</span>
        ) : null}

        {this.state.showSearchResults && this.data.status === 'loaded' ? (
          this.data.results.map((res) => (
            <p key={res._id}>{res.profile.name}</p>
          ))
        ) : null}

        {this.props.children}

      </div>
    )
  }
}

SearchableInput.propTypes = {
  label: React.PropTypes.string,
  hint: React.PropTypes.string,
  placeholder: React.PropTypes.string,
  search: React.PropTypes.object
}

reactMixin(SearchableInput.prototype, ReactMeteorData)
reactMixin(SearchableInput.prototype, RefreshOnLocaleChange)