export const checkDomain = (domain) => {
  const re = /^((?!-))(xn--)?[a-z0-9][a-z0-9-_]{0,61}[a-z0-9]{0,1}\.(xn--)?([a-z0-9\-]{1,61}|[a-z0-9-]{1,30}\.[a-z]{2,})$/;
  return re.test(String(domain).toLowerCase());
};

export const checkEmail = (email) => {
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
};

export const formatDuration = (
  duration,
) => {
  if(duration) {
      const seconds = Math.round(duration) * 1000;
      const from = duration >= 3600 ? 11 : 14;
      const size = duration >= 3600 ? 8 : 5;
      return new Date(seconds).toISOString().substr(from, size)
  }else{
      return '00:00';
  }
};

export const isSafari = () => (/^((?!chrome|android).)*safari/i.test(navigator.userAgent));

export const reorder = (array, startIndex, endIndex) => {
  const result = Array.from(array);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};

export const formatDate = (timestamp) => {
  const a = new Date(timestamp);
  const year = a.getFullYear();
  const month = a.getMonth() + 1;
  const date = a.getDate();
  const time = `${year}-${month > 9 ? month : `0${month}`}-${date > 9 ? date : `0${date}`}`;
  return timestamp ? time : '';
};

export const formatTime = (timestamp) => {
  const a = new Date(timestamp);
  const hours = a.getHours();
  const minutes = a.getMinutes();
  return timestamp ? `${hours < 10 ? `0${hours}`: hours}:${minutes < 10 ? `0${minutes}`: minutes}` : '';
};

export const formatRevisionDate = (timestamp) => {
  const monthList = ['January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'];
  const a = new Date(timestamp);
  const year = a.getFullYear();
  const month = a.getMonth();
  const date = a.getDate();
  const time = a.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: true });
  const convertedDate = `${monthList[month]} ${date}, ${year}, ${time}`;
  return convertedDate;
};

export const formatAnalyticsDate = (timestamp) => {
  const monthList = ['Jan',
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
  const a = new Date(timestamp * 1000);
  const year = a.getFullYear();
  const month = a.getMonth();
  const date = a.getDate();
  const convertedDate = `${monthList[month]} ${date}, ${year}`;
  return convertedDate;
};

const theme = _.get(window.fabricInitConfig, 'portal_theme.name', 'dark');

export const selectStyles = {
  control: provided =>  ({
    ...provided,
    minHeight: 30,
    borderColor: `${theme === 'dark' ? '#404040' : '#ccc'}!important`,
    backgroundColor: theme === 'dark' ? '#404040' : '#fff',
    boxShadow: 'none !important',
    maxHeight: 85,
    overflowX: 'hidden',
    overflowY: 'auto',
  }),
  valueContainer: (provided) => ({
    ...provided,
    padding: '0 0px 0 8px',
  }),
  singleValue: (provided) => ({
    ...provided,
    color: theme === 'dark' ? '#fff' : '#4d4d4d',
    fontSize: 14,
  }),
  indicatorsContainer: () =>  ({
    width: 25,
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  }),
  dropdownIndicator: () =>  ({
    borderColor: '#999 #0000 #0000',
    borderStyle: 'solid',
    borderWidth: '5px 5px 2.5px',
    height: 0,
    width: 0,
    position: 'relative',
    bottom: '-2px',
    svg: {
      display: 'none',
    },
  }),
  indicatorSeparator: () =>  ({
    display: 'none',
  }),
  menu: (provided) =>  ({
    ...provided,
    borderColor: `${theme === 'dark' ? '#404040' : '#ccc'}!important`,
    backgroundColor: theme === 'dark' ? '#404040' : '#fff',
    zIndex: 3,
    overflow: 'hidden'
  }),
  menuList: (provided) =>  ({
    ...provided,
    padding: 0,
    minHeight: 100,
    maxHeight: 100,
  }),
  option:  (provided, state) => {
    return {
      padding: '6px 8px 8px',
      display: 'flex',
      alignItems: 'center',
      fonSize: 14,
      lineHeight: '18px',
      background: theme === 'dark' ?
        state.isSelected && state.isFocused && '#4655d2' || state.isFocused && 'rgba(255, 255, 255, .1)' || state.isSelected && '#4655d2'
        : state.isSelected && state.isFocused && '#4655d2' || state.isFocused && '#dcdee0' || state.isSelected && '#4655d2',
      color: theme === 'dark' ? '#fff':  state.isSelected && '#fff' || '#4d4d4d',
      cursor: 'pointer',
    };
  },
  noOptionsMessage: (provided) =>  ({
    ...provided,
    textAlign: 'left',
  }),
  input: (provided) =>  ({
    ...provided,
    color:  theme === 'dark' ? '#fff' : '#4d4d4d',
    maxWidth: 340
  }),
  multiValue: () =>  ({
    borderRadius: 2,
    background: theme === 'dark' ? '#212121' : '#4d4d4d',
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'center',
    margin: '3px 3px 3px 0',
  }),
  multiValueLabel: () => ({
    color: '#fff',
    fontSize: 14,
    padding: '0 0 0 4px',
    maxWidth: '100%',
    overflow: 'hidden',
    textOverflow: 'ellipsis'
  }),
  multiValueRemove: () => ({
    height: 20,
    width: 16,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    svg: {
      fill: '#ccc'
    },
    '&:hover': {
      svg: {
        fill: '#fff',
      },
    },
  }),
};

export const getFileType = (file) => {
  let fileType = 'video';
  switch (file.type) {
    case 'document':
      fileType = file.original_filename && file.original_filename.includes('.') ? file.original_filename.split('.').pop() : 'file';
      break;
    case 'file':
      fileType = file.original_filename.split('.').pop();
      break;
    case 'performance':
      fileType = 'video';
      break;
    default:
      fileType = file.type;
  }

  return fileType;
}
