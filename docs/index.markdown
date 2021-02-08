---
# Feel free to add content and custom Front Matter to this file.
# To modify the layout, see https://jekyllrb.com/docs/themes/#overriding-theme-defaults

layout: default
---

# SimpleSelect

Tiny javascript library which helps you apply custom style on select and multiselect elements. Easy to configure and use!

## Example
### Single Select

{% include select.html id="single-select" %}

### Multi Select

{% include select.html id="multi-select" multiple="multiple" %}

## Usage
### Via NPM
```bash
npm install @schumskie/simpleselect
```

### Via CDN
```html
<script src="https://unpkg.com/@schumskie/simpleselect"></script>
```

### Code:
```javascript
// If you are using ES6
import SimpleSelect from '@schumskie/simpleselect'

// This will apply simple select to all select elements
SimpleSelect.init('select');

// This will apply simple select to select element with id="select"
SimpleSelect.init('#select');
```

## Styling

Define new theme in your css file using CSS varibles

```css
.simple-select.green {
    --option-selected-color: green;
    --border-radius: 0px;
}
```

Apply new theme to specific element

```javascript
SimpleSelect.init('#green-select', {theme: 'green'});
```

### Result

{% include select.html id="green-select" multiple="multiple" %}

<script>
    SimpleSelect.init('#single-select');
    SimpleSelect.init('#multi-select');
    SimpleSelect.init('#green-select', {theme: 'green'});
</script>
