const defaultFilter = (options, search) =>
  options.filter((item) =>
    item.label.toLowerCase().includes(search.toLowerCase())
  );

export default function ({
  items = [],
  value = null,
  config,
  filterFn = defaultFilter,
}) {
  const store = {
    _listeners: {},
    items: items,
    opened: false,
    config: config,
    value: value,
    query: "",
    itemsMap: items.reduce((acc, item) => ({ ...acc, [item.value]: item }), {}),
    get filtered() {
      if (!this.query) return this.items;
      return filterFn(this.items, this.query);
    },
    get filteredKeys() {
      return this.filtered.map((i) => i.value);
    },
    registerListener(prop, fn) {
      this._listeners[prop] = fn;
    },
    _triggerListener(prop, val) {
      if (prop in this._listeners) this._listeners[prop](val);
    },
  };

  return new Proxy(store, {
    get(target, prop) {
      return target[prop];
    },
    set(target, prop, value) {
      target[prop] = value;
      target._triggerListener(prop, value);
      return true;
    },
  });
}
