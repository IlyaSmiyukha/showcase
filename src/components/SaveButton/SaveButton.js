import React, {
  Fragment,
  useState,
  useEffect,
} from 'react';
import { Transition } from 'react-transition-group';

import PropTypes from 'prop-types';

import {
  ButtonFlat,
} from '@/components/Buttons';

import SvgIcon from '@/components/SvgIcon';
import checkIcon from '@/assets/images/svg/icons/icon-check.svg';

import './SaveButton.less';

const SaveButton = props => {

  const {
    error,
    isPublishing,
    isSaved,
  } = props;

  const [
    showAimation,
    setAnimation,
  ] = useState(false);
  const [
    buttonLabel,
    setButtonLabel,
  ] = useState(props.isSaved ? 'Saved' : 'Save');

  const handleSaveClick = async () => {
    await props.onSaveClick();
  };

  const hideAnimation = () => {
    setAnimation(false);
    setButtonLabel('Saved');
  };

  useEffect(() => {
    props.setSaveClick(handleSaveClick);
  }, []);

  useEffect(() => {
    if (isSaved && !error && !isPublishing) {
      setAnimation(true);
      setButtonLabel('Saved');
    }

    if (!isSaved && !error && !isPublishing) {
      setButtonLabel('Save');
    }

    if (isPublishing) {
      setButtonLabel('Saving...');
    }

    if (error) {
      setButtonLabel('Save');
    }

  }, [
    isPublishing,
    error,
    isSaved,
  ]);


  return <Fragment>
    <Transition
      in={showAimation}
      timeout={2000}
      onEntered={hideAnimation} >
      {state => (
        <SvgIcon
          className={`check-icon animation-${state}`}
          data={checkIcon}
          testid="animation"
        />
      )}
    </Transition>
    {
      buttonLabel === 'Saving...' ? <span className="sc-saving">{buttonLabel}</span> :  <ButtonFlat
        className="save-button save-button-flex"
        disabled={isSaved && !error}
        onClick={handleSaveClick}
      >
        {!showAimation && buttonLabel}
      </ButtonFlat>
    }
  </Fragment>;
};

SaveButton.propTypes = {
  setSaveClick: PropTypes.func,
  onSaveClick: PropTypes.func,
  isSaved: PropTypes.bool,
  error: PropTypes.bool,
  isPublishing: PropTypes.bool,
};

export default SaveButton;
