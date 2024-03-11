import React from 'react';

import { Scrollbars } from 'react-custom-scrollbars';

import './Scrollbar.less';

class Scrollbar extends React.Component {
  constructor(props, ...rest) {
    super(props, ...rest);
    this.renderView = this.renderView.bind(this);
    this.handleTouchmove = this.handleTouchmove.bind(this);
  }

  createTouchEvent(e) {
    return new e.constructor(e.type, e);
  }

  handleTouchmove(e) {
    if (e.path && e.path[0].className !== 'custom-scrollbar') {

      let evt = this.createTouchEvent(e);
      this.dispatchEvent(this.nv.container, evt);
    } else {
      e.stopPropagation();
    }
    return true;
  }

  setRef = (el) => {
    this.nv = el;
  };

  componentDidMount() {
    this.nv.container.addEventListener('touchmove', this.handleTouchmove, true);
  }

  componentWillUnmount() {
    this.nv.container.removeEventListener('touchmove', this.handleTouchmove);
  }


  mouseEvent(type, sx, sy, cx, cy) {
    var evt;
    var e = {
      bubbles: true,
      cancelable: (type !== 'mousemove'),
      view: window,
      detail: 0,
      screenX: sx,
      screenY: sy,
      clientX: cx,
      clientY: cy,
      ctrlKey: false,
      altKey: false,
      shiftKey: false,
      metaKey: false,
      button: 0,
      relatedTarget: null,
    };
    if (typeof(document.createEvent) === 'function') {
      evt = document.createEvent('MouseEvents');
      evt.initMouseEvent(type, e.bubbles, e.cancelable, e.view, e.detail, e.screenX, e.screenY, e.clientX, e.clientY, e.ctrlKey, e.altKey, e.shiftKey, e.metaKey, e.button, document.body.parentNode);
    } else if (document.createEventObject) {
      evt = document.createEventObject();
      for (prop in e) {
        evt[prop] = e[prop];
      }
      evt.button = { 0: 1, 1: 4, 2: 2 }[evt.button] || evt.button;
    }
    return evt;
  }

  dispatchEvent(el, evt) {
    if (el.dispatchEvent) {
      el.dispatchEvent(evt);
    } else if (el.fireEvent) {
      el.fireEvent('on' + type, evt);
    }
    return evt;
  }


  renderView = ({ style, ...props }) => {
    return (
      <div
        className="custom-scrollbar-scroll-box"
        style={style}
        {...props}/>
    );
  }

  renderScrollbar() {
    return (
      <Scrollbars className="custom-scrollbar"
        autoHide
        renderThumbVertical={props => <div {...props} className="thumb-vertical"/>}
        renderThumbHorizontal={props => <div {...props} className="thumb-horizontal" style={{display:'none'}}/>}
        renderTrackHorizontal={props => <div {...props} className="track-horizontal" style={{display:'none'}}/>}
        renderView={this.renderView}
        {...this.props}
        ref={this.setRef}
      />
    );
  }
  render() {
    return (
      this.renderScrollbar()
    );
  }
}

export default Scrollbar;
