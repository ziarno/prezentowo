ButtonCancel = ({onClick}) => (
  <button
    type="button"
    className="ui labeled icon button"
    onClick={(e) => {
      e.preventDefault()
      onClick(e)
    }}>
    <i className="remove icon"></i>
    <T>Cancel</T>
  </button>
)