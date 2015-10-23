var React = require('react');

var Ask = React.createClass({

  getInitialState(){
    return{
      choices:[]
    }
  },

  componentWillMount(){
    this.setUpChoices();
  },

  componentWillReceiveProps(){
    this.setUpChoices();
  },

  setUpChoices(){
    var choices = Object.keys(this.props.question);
    choices.shift();
    this.setState({choices: choices});
  },

	render() {
    return (
      <div id="currentQuestion">
        <h2>{this.props.question.q}</h2>
        <div className="row">
          {this.state.choices.map(this.addChoiceButton)}
        </div>
      </div>
    );
	}
});

module.exports = Ask;
