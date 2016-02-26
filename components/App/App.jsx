App = React.createClass({
  componentDidMount() {
    Utils.attachWaves();
  },
  componentDidUpdate() {
    Utils.attachWaves();
  },
  render() {
    return (
      <div>
        <Header />
        <div className="app-content">
          {this.props.content}
        </div>
      </div>
    );
  }
});