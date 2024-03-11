import footer from '@/store/reducers/footer';
import * as types from '@/store/types/footer';

import {
  revisionFetchInitialData,
  revisionUpdateText,
  resetRfcData,
  revisionDeleteFile,
} from '@/store/types/revisions';

import {
  createRfc,
} from '@/store/types/rfc';

describe('Shortcuts reducer', () => {
  let initialState = {};

  beforeEach(() => {
    initialState = {
      type: 'showcase-footer',
      id: 2,
      text: 'I’m a footer text. Click here to add your own text and edit me.',
      menu: [],
    };
  });

  it('should return the initial state', () => {
    expect(footer(undefined, initialState)).toEqual(initialState);
  });

  it('should handle updateFooterLogo', () => {
    const payload = {
      logo: 'logoId',
      group: 'group',
    };
    expect(footer(initialState, {
      type: types.updateFooterLogo.REQUEST,
      payload,
    })).toEqual({
      ...initialState,
      logo_file: {
        file_id: payload.logo,
        group_path: payload.group,
      },
    });
  });

  it('should handle editFooterMenu add item', () => {
    const payload = {
      type: 'add',
      menuItem: {
        name: 'name',
        id: 1,
      },
    };
    expect(footer(initialState, {
      type: types.editFooterMenu.REQUEST,
      payload,
    })).toEqual({
      ...initialState,
      menu: [payload.menuItem],
    });
  });

  it('should handle editFooterMenu edit item', () => {
    const payload = {
      type: 'edit',
      menuItem: {
        name: 'new name',
        id: 1,
      },
    };
    expect(footer({
      ...initialState,
      menu:[
        {
          name: 'name',
          id: 1,
        },
      ],
    }, {
      type: types.editFooterMenu.REQUEST,
      payload,
    })).toEqual({
      ...initialState,
      menu: [payload.menuItem],
    });
  });

  it('should handle deleteFooterMenu edit item', () => {
    const payload = 1;
    expect(footer({
      ...initialState,
      menu:[
        {
          name: 'name',
          id: 1,
        },
      ],
    }, {
      type: types.deleteFooterMenu.REQUEST,
      payload,
    })).toEqual(initialState);
  });

  it('should handle revisionFetchInitialData', () => {
    const payload = {
      footer:{
        ...initialState,
        text: 'new footer text',
      },
    };
    expect(footer(initialState, {
      type: revisionFetchInitialData.REQUEST,
      payload,
    })).toEqual(initialState);
  });

  it('should handle revisionUpdateText heading', () => {
    const payload = {
      path: 'footer-text',
      text: 'new footer text',
    };
    expect(footer(initialState, {
      type: revisionUpdateText.REQUEST,
      payload,
    })).toEqual({
      ...initialState,
      text: payload.text,
    });
  });

  it('should handle revisionDeleteFile', () => {
    const payload = 1;
    expect(footer({
      ...initialState,
      logo_file: {
        file_id: 1,
      },
    }, {
      type: revisionDeleteFile.REQUEST,
      payload,
    })).toEqual(initialState);
  });

  it('should handle resetRfcData', () => {
    const payload = {};
    expect(footer(initialState, {
      type: resetRfcData.REQUEST,
      payload,
    })).toEqual(initialState);
  });

  it('should handle createRfc', () => {
    const payload = {};
    expect(footer(initialState, {
      type: createRfc.REQUEST,
      payload,
    })).toEqual(initialState);
  });

});
