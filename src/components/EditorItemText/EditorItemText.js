import React, {
  useState,
  useRef,
  useEffect
} from 'react';

import { useDispatch } from 'react-redux';

import PropTypes from 'prop-types';

import locale from '@/api/locale';

import SvgIcon  from '@/components/SvgIcon';
import editIcon from '@/assets/images/svg/icons/icon-edit.svg';

import classnames from 'classnames';

import {
  showEditTextPopup,
} from '@/store/actions/view';

import {
  updateHeaderSettings,
} from '@/store/actions/header';

import './EditorItemText.less';

const MIN_WIDTH = 500;

const EditorItemText = props => {
  const [isActiveResize, setActiveResize] = useState(false);
  const [width, setWidth] = useState(props.maxWidth);
  const elRef = useRef(null);

  const dispatch = useDispatch();

  const {
    itemType,
    itemText,
    maxWidth,
    maxWidthName,
    maxLength
  } = props;

  const onClick = () => {
    const modalName = itemType.split('-')[1] === 'text' ? 'footer' : itemType.split('-')[1];
    dispatch(showEditTextPopup({path: itemType, text: itemText, modalName, maxLength}));
  };

  const itemClassNames = classnames({
    'showcase-edit-item': true,
    italic: !itemText && itemType !== 'button',
    'sc-with-caps': props.withCaps || (typeof props.withCaps === 'undefined' && (itemType === 'categoty-title')),
    [itemType]: true,
  });

  const styles = {
    maxWidth: width && window.innerWidth >= 768 ? width : null,
  };

  const handleResize = e => {
    if (isActiveResize) {
      const clientX = e.clientX || e.touches[0].clientX;
      const width = clientX - elRef.current.getBoundingClientRect().left + 10;
      width > MIN_WIDTH ? setWidth(width) : null
    }
  }

  const handleResizeEnd = () => {
    if (isActiveResize) {
      setActiveResize(false)
      dispatch(updateHeaderSettings({
        name: maxWidthName,
        value: width,
      }));
    }
  }

  useEffect(() => {
    setWidth(maxWidth)
  },[maxWidth])

  return (
    <div className="sc-edit-item-wrap"
      ref={elRef}
      onMouseUp={handleResizeEnd}
      onTouchEnd={handleResizeEnd}
      onMouseLeave={handleResizeEnd}
      onMouseMove={handleResize}
      onTouchMove={handleResize}>

      <div className={itemClassNames}  style={styles}>
        <span className="sc-click-overlay" onClick={props.onItemClick || onClick}/>
        {
          itemType === 'button' && (
            !itemText ? locale.getResource('AddBackgroundButton') : (  <span>
              <span className={`inner-${itemType}`}>{itemText}</span>
              {locale.getResource('ChangeSettings')}
            </span>)
          )
        }

        {
          itemType !== 'button' && <span className={`inner-${itemType}`} dangerouslySetInnerHTML={{ __html: itemText }}/>
        }

        <div className="edit-icon">
          <SvgIcon
            className="edit-icon"
            data={editIcon}
          />
        </div>

        {
          (itemType === 'header-heading' || itemType === 'header-description') && (
            <span className="sc-item-resize"
              onMouseDown={() => setActiveResize(true)}
              onTouchStart={() => setActiveResize(true)}
            />
          )
        }
      </div>
    </div>
  );
};

EditorItemText.propTypes = {
  onItemClick: PropTypes.func,
  itemType: PropTypes.string,
  itemText: PropTypes.any,
  withCaps: PropTypes.bool,
  maxWidth: PropTypes.number,
  maxWidthName: PropTypes.string,
};

export default EditorItemText;
