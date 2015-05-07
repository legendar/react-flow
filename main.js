var React = require('react/addons'),
    _ = require('underscore'),
    IM = require('immutable'),
    debug = require('debug'),
    log = debug('main');
window.myDebug = debug;

var colors = ['red', 'orange', 'yellow', 'green', 'blue', 'violet'];

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

var cells = _(_.range(15 * 15)).map(
      _.partial(getRandomInt, 0, colors.length-1)
    ),
    currentColor = cells[0];

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
            <div className="controls">
              <span className="counter">201</span>
              <button className="btn btn-default pull-right">
                <i className="glyphicon glyphicon-repeat"></i>
              </button>
            </div>
        )
    }
};

class AppComponent extends React.Component {
    render() {
        var {props} = this;
        log(props)
        return (
            <div className={`main-container ${props.currentColor}`}>
                <div className={"wrapper"}>
                    <FieldComponent cells={props.cells}/>
                    <ControlsComponent/>
                </div>
            </div>
        )
    }
}

React.render(
    <AppComponent cells={cells} currentColor={colors[currentColor]}/>,
    document.body
);
