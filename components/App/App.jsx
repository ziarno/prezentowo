App = React.createClass({
  mixins: [ReactMeteorData],
  getMeteorData() {
    return {};
  },
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