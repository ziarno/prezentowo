FormPopup = ({className, children}) => (
  <div
    className={classNames('ui flowing popup form-popup', className)}>
    {children}
  </div>
);