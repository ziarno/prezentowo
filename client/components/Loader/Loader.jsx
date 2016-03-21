Loader = ({visible, size, text}) => (
  <div
    className={classNames('ui inverted dimmer', {
      active: _.isBoolean(visible) ? visible : true
    })}>
    <div className={classNames('ui loader', size, {
      text: !!text
    })}>
      {text || null}
    </div>
  </div>
)