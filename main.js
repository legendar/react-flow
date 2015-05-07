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


    this.handleClick = this.handleClick.bind(this)
    this.isValidIndex = this.isValidIndex.bind(this)
    this.getItemColor = this.getItemColor.bind(this)
  }
  getCurrentColor() {
    return this.cells[0];
  }
  handleClick(i) {
    var desiredColor = this.cells[i];
    if(desiredColor === this.getCurrentColor()) {
      return;
    }
    this.updateCells(desiredColor)
    this.emitChange();
  }
  emitChange() {
    this.emit('change');
  }

  isValidIndex(i) {
    return i >=0 && i < 15*15;
  }

  getSiblings(index) {
    var siblings = [
      // left
      (index % 15 == 0) ? -1 : (index - 1),
      // top
      index - 15,
      // right
      ((index + 1) % 15 == 0) ? -1 : (index + 1),
      // bottom
      index + 15
    ]
    return siblings.filter(this.isValidIndex)
  }

  getItemColor(index) {
    return this.cells[index];
  }

  updateItem(index, newColor) {
    this.cells[index] = newColor
  }

  updateCells(newColor) {
    var itemsToUpdate = []
    this.determineItemsToUpdate(0, newColor, itemsToUpdate);
    itemsToUpdate.forEach((index)=> this.updateItem(index, newColor))
    // TODO update background here
  }

  determineItemsToUpdate(index, newColor, itemsToUpdate) {
    itemsToUpdate.push(index)
    var currentColor = this.getItemColor(index)
    var siblings = this.getSiblings(index);
    var siblingsColors = siblings.map(this.getItemColor);
    siblingsColors.forEach(function(color, i) {
      if(color == currentColor && itemsToUpdate.indexOf(siblings[i]) == -1) {
        this.determineItemsToUpdate(siblings[i], newColor, itemsToUpdate)
      }
    }, this)
  }
}

class FieldComponent extends React.Component {
    handleClick(e) {
      debugger
    }

    render() {
        var {cells, handleClick} = this.props;
        cells = _(cells).map(function(k, i) {
            return <div className={`item ${colors[k]}`} onClick={handleClick.bind(undefined, i)}></div>
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
    this.props.store.addListener('change', this._onChange.bind(this));
  }
  componentWillUnmount() {
    this.props.store.removeListener('change', this._onChange.bind(this));
  }
  _onChange() {
    var {store} = this.props;
    this.setState(store.getState());
  }
  render() {
      var {state, props} = this;
      var handleClick = props.store.handleClick.bind(props.store);
      return (
          <div className={`main-container ${state.currentColor}`}>
              <div className={"wrapper"}>
                  <FieldComponent cells={state.cells} handleClick={handleClick}/>
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
