ButtonRemove = ({onClick}) => (
  <button
    type="button"
    className="ui labeled icon red button"
    onClick={(e) => {
      e.preventDefault()
      onClick(e)
    }}>
    <i className="trash icon"></i>
    <T>Delete</T>
  </button>
)