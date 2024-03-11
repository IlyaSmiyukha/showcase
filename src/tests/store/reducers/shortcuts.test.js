import shortcuts from '@/store/reducers/shortcuts';
import * as types from '@/store/types/shortcuts';

import {
  resetRfcData,
} from '@/store/types/revisions';

import {
  revisionDeleteFile,
} from '@/store/types/revisions';

const newShortcut = {
  id: 2,
  name: 'name',
};

describe('Shortcuts reducer', () => {
  let initialState = {};

  beforeEach(() => {
    initialState = {
      items: [
        {
          id: 1,
          name: 'name',
          thumbnail: {
            file_id: 'id',
          },
        },
      ],
      type: 'showcase-shortcuts',
      id: 4,
    };
  });

  it('should return the initial state', () => {
    expect(shortcuts(undefined, {
      ...initialState,
      items: [],
    })).toEqual({
      ...initialState,
      items: [],
    });
  });

  it('should handle getShortcutInitialData', () => {
    const payload = {
      items: [
        newShortcut,
      ],
    };
    expect(shortcuts(initialState, {
      type: types.getShortcutInitialData.REQUEST,
      payload,
    })).toEqual({
      ...initialState,
      items: [
        ...payload.items,
      ],
    });
  });

  it('should handle addShortcut', () => {
    const payload = newShortcut;
    expect(shortcuts(initialState, {
      type: types.addShortcut.REQUEST,
      payload,
    })).toEqual({
      ...initialState,
      items: [
        ...initialState.items,
        payload,
      ],
    });
  });

  it('should handle editShortcut', () => {
    const payload = {
      id: 1,
      shortcut: {
        ...newShortcut,
        name: 'new name',
      },
    };
    expect(shortcuts({
      ...initialState,
    }, {
      type: types.editShortcut.REQUEST,
      payload,
    })).toEqual({
      ...initialState,
      items: [payload.shortcut],
    });
  });

  it('should handle deleteShortcut', () => {
    const payload = 1;
    expect(shortcuts(initialState, {
      type: types.deleteShortcut.REQUEST,
      payload,
    })).toEqual({
      ...initialState,
      items: [],
    });
  });

  it('should handle revisionDeleteFile', () => {
    const payload = 'id';
    expect(shortcuts(initialState, {
      type: revisionDeleteFile.REQUEST,
      payload,
    })).toEqual({
      ...initialState,
      items: [
        {
          id: 1,
          name: 'name',
          thumbnail: '',
        },
      ],
    });
  });

  it('should handle resetRfcData', () => {
    const payload = {};
    expect(shortcuts(initialState, {
      type: resetRfcData.REQUEST,
      payload,
    })).toEqual({
      ...initialState,
      items: [],
    });
  });

});
