App = class App extends React.Component {
  render() {
    return (
      <div>
        <Header />
        <div className="app-content">
          {this.props.content}
        </div>
      </div>
    )
  }
}