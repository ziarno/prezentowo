App = React.createClass({
  mixins: [ReactMeteorData],
  getMeteorData() {
    return {};
  },
  componentDidMount() {
    Waves.attach('.btn:not(.waves-effect)');
  },
  componentDidUpdate() {
    Waves.attach('.btn:not(.waves-effect)');
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