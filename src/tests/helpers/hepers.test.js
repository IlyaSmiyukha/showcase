import {
  checkDomain,
  checkEmail,
  formatDuration,
  isSafari,
  reorder,
  formatRevisionDate,
} from '@/helpers';


describe('checkDomain util', () => {
  it('positive cases', () => {
    expect(checkDomain('touchcast.com')).toBeTruthy();
    expect(checkDomain('google.com')).toBeTruthy();
  });

  it('negative cases', () => {
    expect(checkDomain('touchcastcom')).not.toBeTruthy();
    expect(checkDomain('googlecom')).not.toBeTruthy();
  });
});

describe('checkEmail util', () => {
  it('positive cases', () => {
    expect(checkEmail('email@touchcast.com')).toBeTruthy();
    expect(checkEmail('email@google.com')).toBeTruthy();
  });

  it('negative cases', () => {
    expect(checkEmail('touchcastcom')).not.toBeTruthy();
    expect(checkEmail('touchcast.com')).not.toBeTruthy();
    expect(checkEmail('@touchcast.com')).not.toBeTruthy();
  });
});

describe('formatDuration util', () => {
  it('positive cases', () => {
    expect(formatDuration(13.03)).toBe('00:13');
    expect(formatDuration(170.85)).toBe('02:51');
    expect(formatDuration(undefined, true)).toBe('00:00');
    expect(formatDuration('13.03')).toBe('00:13');
  });
});

describe('isSafari util', () => {
  expect(isSafari()).not.toBeTruthy();
});

describe('formatDuration util', () => {
  it('positive cases', () => {
    const array = [0,
      1,
      2,
      3,
      4];
    expect(reorder(array, 1, 4)).toStrictEqual([0,
      2,
      3,
      4,
      1]);
    expect(reorder(array, 1, 2)).toStrictEqual([0,
      2,
      1,
      3,
      4]);
    expect(reorder(array, array.length - 1, 1)).toStrictEqual([0,
      4,
      1,
      2,
      3]);
  });
});

describe('formatDuration util', () => {
  it('positive cases', () => {
    expect(formatRevisionDate(1627550029 * 1000)).toBe('July 29, 2021, 12:13:49 PM');
    expect(formatRevisionDate(1626776570 * 1000)).toBe('July 20, 2021, 1:22:50 PM');
  });
});
