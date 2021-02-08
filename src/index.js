import "./select.css";
import createStore from "./store.js";

const $make = (tag, className = "") => {
  const $el = document.createElement(tag);
  $el.className = className;
  return $el;
};

class Display {
  constructor(el, store) {
    this.$el = el;
    this.store = store;
    this.update();
  }
  update() {
    if (this.store.value) {
      this.$el.textContent = this.store.itemsMap[this.store.value].label;
    } else {
      this.$el.textContent = this.store.config.placeholder;
    }
  }
}

class MultiDisplay extends Display {
  constructor(el, store) {
    super(el, store);
    this.$el.addEventListener("click", (e) => {
      if (e.target.dataset.action === "remove") {
        this.remove(e.target.dataset.key);
        e.stopPropagation();
      }
    });
  }
  makeNode(key) {
    const i = $make("div", "simple-select__selected");
    const item = this.store.itemsMap[key];
    i.dataset.action = "remove";
    i.dataset.key = item.value;
    i.textContent = item.label;
    return i;
  }
  remove(value) {
    this.store.value = this.store.value.filter((v) => v !== value);
  }
  update() {
    const items = this.store.value || [];
    this.$el.innerHTML = "";
    items.map((i) => this.makeNode(i)).forEach((n) => this.$el.appendChild(n));
    if (!items.length) {
      this.$el.textContent = this.store.config.placeholder;
    }
  }
}

class OptionList {
  constructor(el, store) {
    this.store = store;
    this.$el = el;
    this.$el.addEventListener("mousedown", (e) => {
      if (e.target.dataset.option) {
        const $option = e.target;
        const key = e.target.dataset.option;

        this.store.query = "";
        this.store.opened = false;
        if (Array.isArray(this.store.value)) {
          if (this.store.value.includes(key)) {
            this.store.value = this.store.value.filter((v) => v !== key);
          } else {
            this.store.value = [...this.store.value, key];
          }
        } else {
          this.store.value = key;
        }
      }
    });
    this.$el.addEventListener("mouseover", (e) => {
      if (e.target.dataset.option) {
        this.setPointed(e.target.dataset.option);
      }
    });

    this.$optionsMap = {};
    for (let key in this.store.itemsMap) {
      const $option = $make("div", "simple-select__option");
      $option.dataset.option = key;
      $option.textContent = this.store.itemsMap[key].label;

      this.$optionsMap[key] = $option;
    }
  }

  update() {
    this.$el.innerHTML = "";
    this.store.filteredKeys.forEach((key, i) => {
      if (i == 0) {
        this.setPointed(key);
      }
      this.$optionsMap[key].classList.remove("simple-select__option--selected");
      if (this.store.value.includes(key)) {
        this.$optionsMap[key].classList.add("simple-select__option--selected");
      }
      this.$el.appendChild(this.$optionsMap[key]);
    });
  }

  setPointed(key) {
    if (this.$pointedElement) {
      this.$pointedElement.classList.remove("simple-select__option--pointed");
    }
    this.$pointedElement = this.$optionsMap[key];
    this.$pointedElement.classList.add("simple-select__option--pointed");
  }
}

class SmartSelect {
  constructor(
    { items = [], value = "", filter = null, multi = false },
    config
  ) {
    this.store = createStore({ items, value, filter, multi, config });

    this.multi = multi;
    this.makeNodes();
    this.display = multi
      ? new MultiDisplay(this.$display, this.store)
      : new Display(this.$display, this.store);

    this.optionList = new OptionList(this.$dropdown, this.store);
    this.registerStoreListeners();
  }
  makeNodes() {
    const html = `
        <div class="simple-select__display-wrapper arrow-down">  
            <div class="simple-select__display"></div>
            <input type="text" class="simple-select__input"/>
        </div>
        <div class="simple-select__dropdown"></div>`;

    this.$root = $make("div", "simple-select");
    if (this.multi) {
      this.$root.classList.add("simple-select--multi");
    }
    if (this.store.config.theme) {
      this.$root.classList.add(this.store.config.theme);
    }
    this.$root.innerHTML = html;
    this.$display = this.$root.querySelector(".simple-select__display");
    this.$displayWrapper = this.$root.querySelector(
      ".simple-select__display-wrapper"
    );
    this.$input = this.$root.querySelector(".simple-select__input");
    this.$dropdown = this.$root.querySelector(".simple-select__dropdown");

    this.$displayWrapper.addEventListener("click", () => {
      this.store.opened = true;
      this.store.query = "";
    });

    this.$input.addEventListener("input", (e) => {
      this.store.query = e.target.value;
    });

    this.$input.addEventListener("keydown", (e) => {
      if (e.keyCode == 13) {
        e.preventDefault();
        if (this.store.filteredKeys.length) {
          if (this.multi) {
            const key = this.store.filteredKeys[0];
            if (this.store.value.includes(key)) {
              this.store.value = this.store.value.filter((v) => v !== key);
            } else {
              this.store.value = [...this.store.value, key];
            }
          } else {
            this.store.value = this.store.filteredKeys[0];
          }
          this.store.opened = false;
        }
      }
    });
    this.$input.addEventListener("blur", (e) => {
      this.store.opened = false;
    });
  }
  registerStoreListeners() {
    this.store.registerListener("query", (val) => {
      this.$input.value = val;
      this.optionList.update();
    });

    this.store.registerListener("opened", (val) => {
      if (val) {
        this.$root.classList.add("simple-select--opened");
        this.$input.focus();
      } else {
        this.$root.classList.remove("simple-select--opened");
      }
    });

    this.store.registerListener("value", (val) => {
      this.display.update();
      if (this.multi) {
        Array.from(this.$el.options).forEach(($opt) => {
          $opt.selected = this.store.value.includes($opt.value);
        });
      } else {
        this.$el.value = val;
      }
    });
  }
}

const init = function (
  el,
  config = {
    placeholder: "Please Select...",
    theme: "",
  }
) {
  const $elements =
    typeof el === "string" ? Array.from(document.querySelectorAll(el)) : [el];

  $elements.forEach(($el) => {
    $el.hidden = true;
    const items = Array.from($el.options).map((o) => ({
      value: o.value,
      label: o.text,
    }));

    let value = Array.from($el.options)
      .filter((o) => o.selected)
      .map((o) => o.value);

    if (!$el.multiple) {
      value = value[0];
    }
    const s = new SmartSelect({ items, value, multi: $el.multiple }, config);
    s.$el = $el;
    $el.insertAdjacentElement("afterend", s.$root);
  });
};

export default { init };
export { init };
