## React searchable dropdown

```
npm i --save react-searchable-dropdown
```

```
import Searchable from 'react-searchable-dropdown';
<Searchable
    value="bSecond" //if value is not item of options array, it would be ignored on mount
    placeholder="Search" // by default "Search"
    notFoundText="No result found" // by default "No result found"
    options={['cSecond', 'ASecond', 'bSecond', 'ASzo']}
    onSelect={value => {
        console.log(value);
    }}
/>
```
