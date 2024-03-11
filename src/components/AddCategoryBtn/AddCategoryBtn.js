import React from 'react';
import { useDispatch } from 'react-redux'
import locale from '@/api/locale';
import { addRow } from '@/store/actions/layout'
import { ButtonNormal } from '@/components/Buttons';

const AddCategoryBtn = () =>  {
  const dispatch = useDispatch();

  const handleAddCategoryClick = () => {
    dispatch(addRow())
  }

  return (
    <div className="btn-container">
      <ButtonNormal onClick={handleAddCategoryClick}>
        {locale.getResource('NewCategory')}
      </ButtonNormal>
    </div>
  );
};


export default AddCategoryBtn;
