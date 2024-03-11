import React from 'react';

import PropTypes from 'prop-types';

import SvgIcon  from '@/components/SvgIcon';
import trashIcon from '@/assets/images/svg/icons/icon-trash.svg';

import './EditorsTable.less';


const EditorsTable= props =>  {
  const {
    editors,
    permisionEdit,
  } = props;

  const convertDate = (timestamp) => {
    const date = new Date(timestamp * 1000);
    const months = ['Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec'];
    return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
  };

  return (
    <table className="sc-editor-table" >
      <thead>
        <tr>
          <th>name</th>
          <th>role</th>
          <th>joined on</th>
          <th>&nbsp;</th>
        </tr>
      </thead>
      <tbody>
        {
          editors.map(editor => <tr key={editor.user_id}>
            <td>
              <span className="sc-name">{editor.first_name} {editor.last_name}</span>
              <span>{editor.email ? editor.email : ''}</span>
            </td>
            <td>{editor.role}</td>
            <td>{editor.role === 'editor' ? convertDate(editor.joined) : ''}</td>
            <td>
              {
                editor.role === 'editor' &&
                <span className="sc-delete-button" onClick={() => permisionEdit('remove', editor.user_id)} role="button">
                  <SvgIcon
                    className="sc-icon-delete"
                    data={trashIcon}
                  />
                </span>
              }
            </td>
          </tr>)
        }
      </tbody>
    </table>
  );
};

EditorsTable.propTypes = {
  editors: PropTypes.array,
  permisionEdit: PropTypes.func,
};

export default EditorsTable;
