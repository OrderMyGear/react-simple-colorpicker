var React = require('react/addons');

var store = require('../store');
var actions = require('../actions');

var Map = React.createClass({

  getInitialState: function () {
    return {
      active: false
    };
  },

  handleMouseDown: function (e) {
    e.preventDefault();
    this.setState({
      active: true
    });
  },

  handleMouseMove: function (e) {
    if (! this.state.active) return;
    var el = this.getDOMNode();
    var rect = el.getBoundingClientRect();
    var x = (e.clientX - rect.left) / rect.width;
    var y = (rect.bottom - e.clientY) / rect.height;

    if (x < 0) x = 0;
    else if (x > 1) x = 1;

    if (y < 0) y = 0;
    else if (y > 1) y = 1;

    actions.setSaturation(x);
    actions.setValue(y);
  },

  handleMouseUp: function () {
    if (! this.state.active) return;
    this.setState({
      active: false
    });
  },

  render: function () {
    var rawHsv = store.toRawHsv();
    var lightness = store.toLum();

    var classes = React.addons.classSet({
      map: true,
      dark: lightness <= 0.5,
      light: lightness > 0.5,
      active: this.state.active
    });

    return (
      /* jshint ignore: start */
      <div
        className={classes}
        onMouseDown={this.handleMouseDown}
        onMouseMove={this.handleMouseMove}
        onMouseUp={this.handleMouseUp}
      >
        <div className="background" style={{
          backgroundColor: store.toHue()
        }} />
        <div className="pointer" style={{
          top: (100 - rawHsv.v * 100) + '%',
          left: rawHsv.s * 100 + '%'
        }} />
      </div>
      /* jshint ignore: end */
    );
  }

});

module.exports = Map;
