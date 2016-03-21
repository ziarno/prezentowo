Ribbon = ({small, children, whiteStiches, color}) => (
  <div className={classNames('ribbon', color, {
    small: small,
    'white-stitches': whiteStiches
  })}>
    <div className="ribbon-stitches-top"></div>
    <div className="ribbon-content">
      {children}
    </div>
    <div className="ribbon-stitches-bottom"></div>
  </div>
)