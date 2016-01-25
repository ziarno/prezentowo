App = React.createClass({
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