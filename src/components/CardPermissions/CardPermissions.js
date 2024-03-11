import React, {
  Fragment,
} from 'react';

import PropTypes from 'prop-types';
import locale from '@/api/locale';

import Radio from '@/components/Radio';
import Checkbox from '@/components/Checkbox';
import Creatable from '@/components/CreatableSelect';

import {
  checkEmail,
} from '@/helpers';

import './CardPermissions.less';

const options = [
  'Off',
  'OnForEditors',
  'OnNoRequest',
  // 'OnWithRequest',
];

const CardPermissions = props => {
  const {
    active,
    permissions,
    onTypeChange,
    onPersonsChange,
    showError,
    emailsList
  } = props;

  return (
    <div className="sc-permissions-form">
      <label className="sc-input-label">{locale.getResource('CardPermissions')}</label>
      {
        options.map(option =>(<Radio
          key={option}
          disabled={false}
          defaultChecked={active === option || active === 'OnWithRequest' && option === 'OnNoRequest'}
          id={`publish-option-${option}`}
          name={'cardPermissionsType'}
          value={option}
          onChange={() => {
            onTypeChange(option);
          }}>
          {locale.getResource(option)}
        </Radio>))
      }
      {
        (active === 'OnNoRequest' || active === 'OnWithRequest') &&
          <Fragment>
            <Checkbox
              defaultChecked={active === 'OnWithRequest'}
              name="OnWithRequest"
              value="OnWithRequest"
              disabled={active === 'Off' || active === 'OnForEditors'}
              onChange={() => {
                onTypeChange(active === 'OnWithRequest' ? 'OnNoRequest' : 'OnWithRequest');
              }}>
              {locale.getResource('OnWithRequest')}
            </Checkbox>
            <Creatable
              className={'sc-select'}
              onChange={onPersonsChange}
              options={emailsList}
              isMulti={true}
              isClearable={false}
              isValidNewOption={inputValue => (inputValue && checkEmail(inputValue) || inputValue.includes(';')|| inputValue.includes(','))}
              formatCreateLabel={label => label.includes(';')|| label.includes(',') ? 'Add multiple emails' : checkEmail(label) && `Add email ${label}`}
              noOptionsMessage={() => 'Type to add emails'}
              placeholder={'Type to add emails'}
              value={permissions.map(item => ({
                label: item,
                value: item,
              }))}/>
          </Fragment>
      }

      {showError && <div className="sc-input-error">
        Add at least one email or allow people to request access to view the card.
      </div>}
    </div>
  );
};

CardPermissions.propTypes = {
  onTypeChange: PropTypes.func,
  onPersonsChange: PropTypes.func,
  active: PropTypes.string,
  permissions: PropTypes.array,
  showError: PropTypes.bool,
};

export default CardPermissions;
