<script src="https://unpkg.com/@schumskie/simpleselect"></script>
# SimpleSelect

Tiny javascript library which helps you apply custom style on select and multiselect elements. Easy to configure and use!

## Example
### Single Select

{% include select.html %}

### Multi Select

{% include select.html multiple="multiple" %}

## Usage
### Via NPM
```bash
npm install @schumskie/simpleselect
```

### Via CDN
```html
<script src="https://unpkg.com/@schumskie/simpleselect"></script>
```

Code:
```javascript
// If you are using ES6
import SimpleSelect from '@schumskie/simpleselect'

// This will apply simple select to all select elements
SimpleSelect.init('select');

// This will apply simple select to select element with id="select"
SimpleSelect.init('#select');
```

For more details see [GitHub Flavored Markdown](https://guides.github.com/features/mastering-markdown/).

### Jekyll Themes

Your Pages site will use the layout and styles from the Jekyll theme you have selected in your [repository settings](https://github.com/schumskie/simpleselect/settings). The name of this theme is saved in the Jekyll `_config.yml` configuration file.

### Support or Contact

Having trouble with Pages? Check out our [documentation](https://docs.github.com/categories/github-pages-basics/) or [contact support](https://support.github.com/contact) and we’ll help you sort it out.

<script>
    SimpleSelect.init('select');
</script>
