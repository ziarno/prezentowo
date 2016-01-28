App = React.createClass({
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
        <div className="content">
          {this.props.content}
        </div>
      </div>
    );
  }
});