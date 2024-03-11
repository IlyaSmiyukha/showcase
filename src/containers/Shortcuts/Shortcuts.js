import React, {
  PureComponent,
} from 'react';

import {
  connect,
} from 'react-redux';

import PropTypes from 'prop-types';

import locale from '@/api/locale';

import AddItem from '@/components/AddItem';
import ShortcutItem from '@/components/ShortcutItem';
import SliderArrow from '@/components/SliderArrow';
import { ButtonNormal } from '@/components/Buttons';

import {
  getShortcutsList,
} from '@/store/selectors/shortcuts';

import { showShortcutsPopup } from '@/store/actions/view';

import {
  isSafari,
} from '@/helpers';

import './Shortcuts.less';

class Shortcuts extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      hideLeft: true,
      hideRight: true,
      items: [],
    };

    this.scrollable = React.createRef();
  }

  addNewItem = () => {
    this.props.showShortcutsPopup({
      action: 'add',
    });
  }

  setRef = (el) => {
    this.scrollable = el;
  };

  handleScroll = () => {
    const {
      offsetWidth,
      scrollLeft,
      scrollWidth,
    } = this.scrollable;
    const isOverflown = this.isOverflown();
    const hideRight = scrollWidth <= scrollLeft + offsetWidth + 1 || !isOverflown;
    const hideLeft = scrollLeft <= 1 || !isOverflown;
    this.setState({
      hideLeft,
      hideRight,
    });
  }

  handleArrowClick = (e, flip) => {
    const {
      offsetWidth,
      scrollLeft,
    } = this.scrollable;
    const scrollTo = scrollLeft + (flip ? -offsetWidth : offsetWidth);
    const itemWidth = 236;

    const safari = isSafari();

    if (this.scrollable.scroll) {
      this.scroll(scrollTo - scrollTo % itemWidth);
    } else {
      //Safari, IE and Edge
      const path = offsetWidth - offsetWidth % itemWidth;
      const devider = 300;
      const step = Math.ceil(offsetWidth / devider);
      for (let i = 0; i < path; i += step) {
        _.delay(() => {
          flip ? this.scrollable.scrollLeft -= step : this.scrollable.scrollLeft += step;
        }, 0);
      }

    }
  }

  scroll = leftPos => {
    if (this.scrollable.scroll) {
      this.scrollable.scroll(leftPos, 0);
    } else {
      this.scrollable.scrollLeft = leftPos;
    }
  }

  isOverflown = () => {
    const {
      shortcuts,
    } = this.props;
    const {
      clientWidth = 0,
    } = this.scrollable;
    const itemWidth = 236;
    return (shortcuts.length + 1) * itemWidth > clientWidth;
  }

  componentDidUpdate(prevProps) {
    if (prevProps.shortcuts.length !== this.props.shortcuts.length) {
      this.handleScroll();
    }
  }

  componentDidMount() {
    this.scroll(1);
  }

  render() {
    const {
      shortcuts,
    } = this.props;

    const {
      hideLeft,
      hideRight,
    } = this.state;


    return (
      <div className="sc-shortcuts-wrapper">
        <div className='sc-shortcut-control'>
          <ButtonNormal onClick={this.addNewItem}>{locale.getResource('addFiles')}</ButtonNormal>
        </div>
        <div className="sc-shortcuts-content">
          {!hideLeft && <SliderArrow flipped={true} onClick={this.handleArrowClick} display={true}/>}
          <div
            className="sc-shortcuts-scroll-container"
            onScroll={this.handleScroll}
            ref={this.setRef}
          >
            {
              shortcuts.map(item => <ShortcutItem
                key={item.id}
                shortcut={item}/>)
            }
            <AddItem onClick={this.addNewItem} text={locale.getResource('NewShortcut')}/>
          </div>
          {!hideRight && <SliderArrow flipped={false} onClick={this.handleArrowClick} display={true}/>}
        </div>
      </div>
    );
  }
}

Shortcuts.propTypes = {
  shortcuts: PropTypes.array,
  showShortcutsPopup: PropTypes.func,
};

const mapStateToProps = state => ({
  shortcuts: getShortcutsList(state),
});

const mapDispatchToProps = {
  showShortcutsPopup,
};

export default connect(mapStateToProps, mapDispatchToProps)(Shortcuts);
