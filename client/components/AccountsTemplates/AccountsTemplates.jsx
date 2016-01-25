var IncludeTemplate = React.createClass({
  componentDidMount: function() {
    var componentRoot = ReactDOM.findDOMNode(this);
    var parentNode = componentRoot.parentNode;
    parentNode.removeChild(componentRoot);
    return Blaze.renderWithData(Template[this.props.blazeTemplate], null, parentNode);
  },
  render: function(template) {
    return (<div />)
  }
});

var BlazeToReact2 = React.createClass({
  mixins: [ReactMeteorData],
  renderBlaze() {
    console.trace();
    this.removeBlaze();
    var componentRoot = ReactDOM.findDOMNode(this);
    return Blaze.renderWithData(Template[this.props.blazeTemplate], _.omit(this.props, 'blazeTemplate'), componentRoot);
  },
  removeBlaze() {
    if (this.view) Blaze.remove(this.view);
  },
  getMeteorData() {
    // Ensure a re-rendering of the template if a prop changes
    //this.renderBlaze();
    return this.props;
  },
  componentDidMount() {
    return this.renderBlaze();
  },
  componentWillUnmount() {
    this.removeBlaze();
  },
  render() {
    return <div />
  }
});


AccountsTemplates = React.createClass({
  componentDidMount: function() {
    Waves.attach('.btn:not(.waves-effect)', ['waves-effect']);
  },
  render() {
    return (
      //<div className="well">
        <BlazeToReact2 blazeTemplate="atForm" />
      //</div>
    );
  }
});