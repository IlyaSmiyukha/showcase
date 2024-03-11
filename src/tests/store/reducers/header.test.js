import header from '@/store/reducers/header';
import * as types from '@/store/types/header';

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
      heading: '<h1>I’m a heading. Click here to edit me.</h1>',
      description: '<p>I’m a paragraph. Click here to add your own text and edit me. It’s easy. Just hit the «Edit» button from top right or click anywhere on me.<p>',
      type: 'showcase-header',
      id: 1,
      settings: {},
      button:{
        label: '',
      },
    };
  });

  it('should handle updateHeaderLogo', () => {
    const payload = {
      logo: 'logoId',
      group: 'group',
    };
    expect(header(initialState, {
      type: types.updateHeaderLogo.REQUEST,
      payload,
    })).toEqual({
      ...initialState,
      logo_file: {
        file_id: payload.logo,
        group_path: payload.group,
      },
    });
  });

  it('should handle updateBackground', () => {
    const payload = {
      background: 'bgId',
      group: 'group',
    };
    expect(header(initialState, {
      type: types.updateBackground.REQUEST,
      payload,
    })).toEqual({
      ...initialState,
      video_background: {
        file_id: payload.background,
        group_path: payload.group,
      },
    });
  });

  it('should handle updateButton', () => {
    const payload = {
      name: 'name',
    };
    expect(header(initialState, {
      type: types.updateButton.REQUEST,
      payload,
    })).toEqual({
      ...initialState,
      button: payload,
    });
  });

  it('should handle revisionFetchInitialData', () => {
    const payload = {
      ...initialState,
      heading: 'new heading',
    };
    expect(header(initialState, {
      type: revisionFetchInitialData.REQUEST,
      payload,
    })).toEqual(initialState);
  });

  it('should handle revisionUpdateText heading', () => {
    const payload = {
      path: 'header-heading',
      text: 'new heading',
    };
    expect(header(initialState, {
      type: revisionUpdateText.REQUEST,
      payload,
    })).toEqual({
      ...initialState,
      heading: payload.text,
    });
  });

  it('should handle revisionUpdateText description', () => {
    const payload = {
      path: 'header-description',
      text: 'new descr',
    };
    expect(header(initialState, {
      type: revisionUpdateText.REQUEST,
      payload,
    })).toEqual({
      ...initialState,
      description: payload.text,
    });
  });

  it('should handle revisionDeleteFile', () => {
    const payload = 1;
    expect(header({
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
    expect(header(initialState, {
      type: resetRfcData.REQUEST,
      payload,
    })).toEqual(initialState);
  });

  it('should handle createRfc', () => {
    const payload = {};
    expect(header(initialState, {
      type: createRfc.REQUEST,
      payload,
    })).toEqual(initialState);
  });

});
