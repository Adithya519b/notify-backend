let subscription = null;
module.exports = {
  set(sub) {
    subscription = sub;
  },
  get() {
    return subscription;
  }
};
