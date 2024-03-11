import data from '@/locales/locale.json';

class CurrentLocale {
  constructor(localeKeyValue) {
    this.data = localeKeyValue;
  }

  hasResource(key) {
    return this.data.hasOwnProperty(key);
  }
  getResource(key) {
    if (this.hasResource(key)) {
      return this.data[key];
    }

    return `Resource Key: {${key}} not found`;
  }
}

export default new CurrentLocale(data);
