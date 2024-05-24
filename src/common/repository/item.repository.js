import './base.repository';

export default {
  saveItem(item) {
    item.date = new Date();
    return this.save(item);
  }
};
