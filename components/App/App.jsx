import {attachWaves} from '../../lib/utilities';

App = React.createClass({
  componentDidMount() {
    attachWaves();
  },
  componentDidUpdate() {
    attachWaves();
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