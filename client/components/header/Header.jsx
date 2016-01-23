const {Paper} = MUI;

Header = React.createClass({
  mixins: [ReactMeteorData],
  getMeteorData() {
    return {};
  },
  render() {
    return (
      <Paper className="header"
             zDepth={2}
             rounded={false}>
        <h1>Prezentowo</h1>
      </Paper>
    );
  }
});
