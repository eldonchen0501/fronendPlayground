/**
 * NOTE(tiwen):
 * I copied this class from https://github.com/SergioCrisostomo/react-onoff-switch
 * because unfortunately his module setup doesn't work with react-scripts' webpack system.
 * I'll try to help him later to make this module works on react-scripts based apps.
 */
/* eslint-disable */
import React from 'react';

const grey = '#CCC';
const offBackground = {
  top: 0,
  boxShadow: `inset 0 0 0px 1px ${grey}`,
  height: 0.6,
  left: 0,
  width: 1,
};
const onBackground = {
  top: 0,
  height: 0.6,
};
const buttonStyle = {
  height: 0.6,
  width: 0.6,
  top: 0,
};
const commonStyles = {
  position: 'absolute',
  borderRadius: 0.3,
  transition: '0.1s ease-in-out',
};
const setStyles = (obj, width) => {
  const styles = {
    ...obj,
    ...commonStyles,
  };
  for (const key in styles) {
    if (typeof styles[key] === 'number') styles[key] = `${width * styles[key]}px`;
  }
  return styles;
};

const componentDefaults = {
  width: 50,
  buttonColor: '#FFFFFF',
  passiveColor: '#FFFFFF',
  activeColor: '#13BF11',
};

const stopEvent = (e) => {
  e.preventDefault();
  e.stopPropagation();
};

export default class OnOff extends React.Component {
  constructor(props) {
    super(props);
    const active = !!props.initialValue;
    this.state = {
      ...componentDefaults,
      ...props,
      on: active, // false if not set
      activeColorWidth: active ? 1 : 0.6,
      buttonPosition: active ? 0.4 : 0,
    };

    this.handleChange = this.handleChange.bind(this);
    this.onChange = props.onChange || (() => {
    });
    this.onPointerDown = this.onPointerDown.bind(this);
    this.onDrag = this.onDrag.bind(this);
    this.onDragEnd = this.onDragEnd.bind(this);
  }

  handleChange(state) {
    const val = typeof state === 'boolean' ? state : !this.state.on;
    this.setState({
      on: val,
      buttonPosition: val ? 0.4 : 0,
      activeColorWidth: val ? 1 : 0.6,
    },
        () => this.onChange(this.state.on) // callback to parent Component
    );
  }

  getPointerCoords(e) {
    return e.pageX || e.touches[0].pageX;
  }

  onPointerDown(e) {
    stopEvent(e);
    this.touchDown = this.getPointerCoords(e.nativeEvent) - parseInt(e.target.style.left, 10);
    window.addEventListener('ontouchend' in window ? 'touchend' : 'mouseup', this.onDragEnd);
  }

  onDrag(e) {
    if (!this.touchDown) return;
    this.dragged = true;
    stopEvent(e);

    // 0.4 and 0.6 are related to proportions where 1 is the width
    // 0.4 is the most left point of the buttonPosition
    // 0.6 is the most right point, so the active color fills the whole background behind the button

    const positionNow = this.getPointerCoords(e.nativeEvent);
    let diff = (positionNow - this.touchDown) / this.state.width;
    const maxDragDistance = 0.4;
    if (diff < 0) diff = 0;
    else if (diff > maxDragDistance) diff = maxDragDistance;
    const pos = 0.6 + diff;

    this.setState({
      buttonPosition: diff,
      activeColorWidth: pos,
    });
  }

  onDragEnd(e) {
    stopEvent(e);
    if (!this.touchDown) return;

    window.removeEventListener('ontouchend' in window ? 'touchend' : 'mouseup', this.onDragEnd);
    const newState = this.dragged ? this.state.buttonPosition > 0.2 : !this.state.on;
    this.handleChange(newState);
    this.touchDown = this.dragged = null;
  }

  render() {
    const on = this.state.on;

    const active = setStyles({
      ...onBackground,
      width: this.state.activeColorWidth,
      background: this.state.activeColor,
    }, this.state.width);

    const passive = setStyles({
      ...offBackground,
      background: this.state.passiveColor,
    }, this.state.width);

    const button = setStyles({
      ...buttonStyle,
      left: this.state.buttonPosition,
      boxShadow: `inset 0 0 0 1px ${on ? this.state.activeColor : grey}, 0 2px 4px ${grey}`,
      background: this.state.buttonColor,
    }, this.state.width);

    return (
      <div style={{position: 'relative', height: 0.6 * this.state.width}}>
        <div style={passive} />
        <div style={active} />
        <div
          onMouseMove={this.onDrag}
          onTouchMove={this.onDrag}
          onTouchStart={this.onPointerDown}
          onMouseDown={this.onPointerDown}
          onMouseOut={this.onDragEnd}
          style={button}
        />
      </div>
    );
  }
}
