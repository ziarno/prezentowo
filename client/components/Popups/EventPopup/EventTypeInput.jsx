import {InputValidation} from '../../../../lib/Mixins';

EventTypeInput = React.createClass({

  mixins: [InputValidation],

  getInitialState() {
    return {
      type: null
    };
  },

  reset() {
    this.setState(this.getInitialState());
  },

  getValue() {
    return this.state.type;
  },

  setValue(type) {
    this.setState({type});
  },

  setType(type) {
    this.validate(type);
    this.setState({type});
  },

  render() {

    var getButton = (type) => {
      var isManyToMany = (type === 'many-to-many');

      return (
        <div
          id={type}
          onClick={() => this.setType(type)}
          className={classNames('ui button', {
              active: this.state.type === type
            })}>
          <div>
            <i className="large users icon"></i>
            <i className={classNames('large', {
              exchange: isManyToMany,
              'long arrow right': !isManyToMany
            }, 'icon')} />
            <i className={classNames('large', {
              users: isManyToMany,
              user: !isManyToMany
            }, 'icon')} />
          </div>
          <p>
            {isManyToMany ? (
              <T>Many to Many</T>
            ) : (
              <T>Many to One</T>
            )}
          </p>
        </div>
      );
    };

    return (
      <div className={classNames('ui field', {
        error: this.shouldShowError()
      })}>

        <label>
          <T>Type</T>
        </label>

        {getButton('many-to-many')}
        <p className="hint">
          <T>hints.Christmas</T>
        </p>

        {getButton('many-to-one')}
        <p className="hint">
          <T>hints.Birthday</T>
        </p>

      </div>
    );
  }
});