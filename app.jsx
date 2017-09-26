var PLAYERS = [
  {
    name: "Chaz Henricks",
    score: 100,
    id: 1
  },
  {
    name: "Eliza Meeks",
    score: 20,
    id: 2
  },
  {
    name: "Matt Augsburger",
    score: 56, 
    id: 3
  },
]

var nextID = 4;

var Stopwatch = React.createClass({

getInitialState : function(){
  return {
    runnning: false,
  }
},

onStart : function(){
  this.setState({running: true});
},

onStop: function(){
  this.setState({running: false});
},

reset : function(){

},
  render: function(){
    

    return (
      <div className="stopwatch">
        <h2>Stopwatch</h2>
        <div className="stopwatch-time">0</div>
        { this.state.running ? <button onClick={this.onStop}>Stop</button> : <button onClick={this.onStart}>Start</button> }
        <button onClick={this.reset}>Reset</button>
      </div>
    );
  }
});



var AddPlayerForm = React.createClass({

  propTypes: {
    onAdd: React.PropTypes.func.isRequired,
  },

  getInitialState: function(){
    return{
      name:"", 
    };
  },

  onNameChange: function(e){
    this.setState({
      name: e.target.value
    })
  },

  onSubmit: function(e){
    e.preventDefault();
    this.props.onAdd(this.state.name);
    this.setState({
      name: ""
    })
  },

  render : function(){
    return (
      <div className="add-player-form">
        <form onSubmit={this.onSubmit}>
          <input type="text" value={this.state.name} onChange={this.onNameChange}/>
          <input type="submit" value="Add Player"/>
        </form>
      </div>
    );
  }
});

function Stats(props){
  var totalPlayers = props.players.length;
  var totalPoints = props.players.reduce(function(total, player){
    return total + player.score;
  }, 0);

  return(
    <table className="stats">
      <tBody>
        <tr>
          <td>Players:</td>
          <td>{totalPlayers}</td>
        </tr>
        <tr>
          <td>Total Points:</td>
          <td>{totalPoints}</td>
        </tr>
      </tBody>
    </table>
  );
}

Stats.propTypes = {
  players: React.PropTypes.array.isRequired,
};

//components start with a Capital Letter
function Header(props){
  return (
    <div className="header">
      <Stats players={props.players}/>
      {/* whatever is passed as "title="whatever"" where application is called will show up here */}
      <h1>{props.title}</h1>
      <Stopwatch />
    </div>
  );
}
Header.propTypes = {
  title: React.PropTypes.string.isRequired,
  players: React.PropTypes.array.isRequired,
};

//this can be a set as defult props to be set before user interaction
Header.defaultProps = {
  title: "Scoreboard"
}


function Counter(props){
  return(
      <div className="counter">
        <button className="counter-action decrement" onClick={function() {props.onChange(-1);}}>-</button>
        {/*When inside a compoent class - props is a method of the component class
        because of this, we need to use this.props to indicate that we are using props that are assign to 
        this specific component class*/}
        <div className="counter-score"> {props.score} </div>
        {/*onCLick method calls incrementScore method that is contained inside this class*/}
        <button className="counter-action increment"onClick={function() {props.onChange(+1);}}>+</button>          
      </div>
  );
}

Counter.propTypes = {
  score: React.PropTypes.number.isRequired,
  onChange: React.PropTypes.func.isRequired,
}

function Player(props){
  return (
    <div className="player">
      <div className="player-name">
        <a className="remove-player" onClick={props.onRemove}>X</a>
        {props.name}
      </div>
      <div className="player-score">
        <Counter score={props.score} onChange={props.onScoreChange}/>
      </div>
  </div>
  );
}

Player.propTypes = {
  name: React.PropTypes.string.isRequired,
  score: React.PropTypes.number.isRequired,
  onScoreChange: React.PropTypes.func.isRequired,
  onRemove: React.PropTypes.func.isRequired,
}


var Application = React.createClass({
  //propTypes let you strongly type properties that can apply to a component. Will show an error in the console.
  //Acts as an error handling 
  //should fill out for each component
  propTypes: {
    title: React.PropTypes.string,
    initialPlayers: React.PropTypes.arrayOf(React.PropTypes.shape({
      name: React.PropTypes.string.isRequired,
      score: React.PropTypes.number.isRequired,
      id: React.PropTypes.number.isRequired
    })).isRequired,
  },



  getDefaultProps: function(){
    return {
      title: "Scoreboard"
    }
  },

  getInitialState: function(){
    return {
      players: this.props.initialPlayers,
    };
  },

  onScoreChange: function(index, delta){
    console.log("onScoreChange", index, delta);
    this.state.players[index].score += delta;
    this.setState(this.state);
  },

  onPlayerAdd(name){
    console.log("Player added", name);
    this.state.players.push({
      name: name,
      score: 0,
      id: nextID,
    });
    this.setState(this.state);
    nextID ++;
  },

  onRemovePlayer: function(index){
    this.state.players.splice(index, 1);
    this.setState(this.state);
  },

  render: function(){
    return (
      //react doesnt use 'class' but 'className' -> class is reserved in JS for making new classes
      <div className="scoreboard">
       {/*Insearting extracted header component*/}
        <Header title={this.props.title} players={this.state.players}/>
        <div className="players">
          {this.state.players.map(function(player, index){
            return (
              <Player
                onScoreChange={function(delta) {this.onScoreChange(index,delta)}.bind(this)} 
                onRemove={function(){this.onRemovePlayer(index)}.bind(this)}
                name={player.name} 
                score={player.score} 
                key={player.id}/>
            );
          }.bind(this))}
        </div>
        <AddPlayerForm onAdd={this.onPlayerAdd}/>
      </div>
    );
  }
})

ReactDOM.render(<Application initialPlayers={PLAYERS}/>, document.getElementById('container'));

