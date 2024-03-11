import React, {
 useState
} from 'react';

import PropTypes from 'prop-types';
import classnames from 'classnames';

import locale from '@/api/locale';

import './AddVideo.less';


const AddVideo = ({ 
  category,
  onClick,
  settings
 }) => {
  const [dragEnter, setDragEnter] = useState(false)

  const handleDragEnter = () => {
    setDragEnter(true)
  }

  const handleDragLeave = () => {
    setDragEnter(false)
  }

  const classNames = classnames({
    'showcase-add-video': true,
    selected: dragEnter,
  });

  const styles = {
    paddingTop: `calc(65% + ${!settings.hideCardTitle ? '40px' : '0px'} + ${settings.personSettings ? '48px' : '0px'} + ${settings.showCardPublishedDate ? '24px' : '0px'})`
  }
  
  return (
    <div
      className={classNames}
      onClick={category ? () => onClick(category) : void 0}
      onMouseEnter={handleDragEnter}
      onMouseLeave={handleDragLeave}
      style={styles}
    >
     <span> {category && locale.getResource('AddVideo')}</span>
    </div>
  )
}


AddVideo.propTypes = {
  onClick: PropTypes.func,
  category: PropTypes.string,
};

export default AddVideo;
