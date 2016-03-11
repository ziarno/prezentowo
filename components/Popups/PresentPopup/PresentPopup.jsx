import {Popup} from '../../../lib/Mixins';

PresentPopup = React.createClass({

  mixins: [ReactMeteorData, Popup],

  propTypes: {
    //onSubmit: React.PropTypes.func.isRequired,
    //trigger: React.PropTypes.func
  },

  getMeteorData() {
    this.schema = this.schema || Presents.Schemas.NewPresent
        .namedContext('newPresent');

    return {
      errors: this.schema.invalidKeys()
    };
  },

  reset() {
    this.refs.addParticipantForm.reset();
  },

  hideAndReset() {
    this.hidePopup(this.reset);
  },

  updateImages({gender}) {
    var avatarsCount = 12;
    var fileLetterName = gender === 'female' ? 'f' : 'm';
    var avatars = _.range(avatarsCount).map((index) => (
      `/images/avatars/${fileLetterName}${index + 1}.png`
    ));
    this.setState({images: avatars});
  },

  submit(formData) {
    if (this.schema.validate(_.omit(formData, 'sendEmail'))) {
      this.props.onSubmit(formData);
      this.hideAndReset();
    }
  },

  render() {

    var AddPresentButton = (
      <div
        ref="popupTrigger"
        className="circular ui icon button left waves-effect waves-button">
        <i className="large icons">
          <i className="gift icon"></i>
          <i className="plus corner icon"></i>
        </i>
      </div>
    );

    var Popup = (
      <div
        ref="popup"
        className=" ui flowing popup form-popup">
        <div className="ui attached message">
          <div className="header">
            <T>New present</T>
          </div>
        </div>
      </div>
    );

    return (
      <div>
        {AddPresentButton}
        {Popup}
      </div>
    );

  }
});