var React = require('react/addons'),
    _ = require('underscore'),
    IM = require('immutable'),
    debug = require('debug'),
    log = debug('main'),
    EventEmitter = require('events').EventEmitter;
    
window.myDebug = debug;

var colors = ['red', 'orange', 'yellow', 'green', 'blue', 'violet'];

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

class Storage extends EventEmitter {
  refresh() { 
    this.cells = _(_.range(15 * 15)).map(
      _.partial(getRandomInt, 0, colors.length-1)
    );
  }
  getState() {
    return {
      cells: this.cells,
      currentColor: this.getCurrentColor(),
      turns: 15
    };
  }
  constructor() {
    super();
    this.refresh();
  }
  getCurrentColor() {
    return this.cells[0];
  }
  handleClick(i) {
    var desiredColor = this.cells[i];
    if(desiredColor === this.getCurrentColor) {
      return;
    }
    refresh();
    this.emitChange();
  }
  emitChange() {
    this.emit('change');
  }

}


class FieldComponent extends React.Component {
    render() {
        var {cells} = this.props;
        cells = _(cells).map(function(k) {
            return <div className={`item ${colors[k]}`}></div>
        })
        return (
            <div className="game-container clearfix">
                {cells}
            </div>
        )
    }
};
class ControlsComponent extends React.Component {
    render() {
        return (
            <div className="controls clearfix">
              <span className="counter">201</span>
              <button className="btn btn-default pull-right">
                <i className="glyphicon glyphicon-repeat"></i>
              </button>
            </div>
        )
    }
};

class AppComponent extends React.Component {
  constructor(props) {
    super(props)
    this.state = props.store.getState()
  }
  componentDidMount() {
    debugger
    this.props.store.addListener('change', this._onChange.bind(this));
  }
  componentWillUnmount() {
    this.props.store.removeListener('change', this._onChange.bind(this));
  }
  _onChange() {
    var store = this.props;
    this.setState(store.getState());
  }
  render() {
      var {state} = this;
      return (
          <div className={`main-container ${state.currentColor}`}>
              <div className={"wrapper"}>
                  <FieldComponent cells={state.cells}/>
                  <ControlsComponent/>
              </div>
          </div>
      )
  }
}

React.render(
    <AppComponent store={new Storage()}/>,
    document.body
);
