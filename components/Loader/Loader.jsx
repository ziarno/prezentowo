Loader = ({visible}) => (
  <div
    className={classNames('ui inverted dimmer', {
        active: visible
      })}>
    <div className="ui loader"></div>
  </div>
);