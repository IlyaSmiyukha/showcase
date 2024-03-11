import React from 'react';
import locale from '@/api/locale';
import {
    ButtonFlat,
    ButtonNormal,
} from '@/components/Buttons';

const Controls = ({handleClose, onSaveClick, isSaveDisabled, saveLabel}) =>  {
    return (
        <div className="sc-buttons-container">
            <ButtonFlat
                className="confirmation-cancel"
                onClick={handleClose}
            >
                {locale.getResource('Cancel')}
            </ButtonFlat>

            <ButtonNormal
                className="confirmation-yes"
                disabled={isSaveDisabled}
                onClick={onSaveClick}
                testId={'add-file'}
            >
                {saveLabel}
            </ButtonNormal>
        </div>
    );
};


export default Controls;
