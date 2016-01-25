Header = React.createClass({
  mixins: [ReactMeteorData],
  getMeteorData() {
    return {};
  },
  render() {
    return (
      <div className="app-header shadow no-selection">
        <h1 className="title no-selection">Prezentowo</h1>
        <LoginNavButton />
      </div>
    );
  }
});
