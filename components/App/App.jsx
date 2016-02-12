App = React.createClass({
  mixins: [ReactMeteorData],
  getMeteorData() {
    return {};
  },
  componentDidMount() {
    Waves.attach('.button', ['waves-button']);
  },
  componentDidUpdate() {
    Waves.attach('.button', ['waves-button']);
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