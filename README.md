## React searchable dropdown

```
npm i --save react-searchable-dropdown
```

```
import Searchable from 'react-searchable-dropdown';
<Searchable
    value=""
    placeholder="Search" // by default "Search"
    notFoundText="No result found" // by default "No result found"
    noInput
    options={[{
        value: '',
        label: 'All'
    }, {
        value: 'popular',
        label: 'Popular
    }]}
    onSelect={value => {
        console.log(value);
    }}
    listMaxHeight={200} //by default 140
/>

<Searchable
    value={['popular']}
    multiple
    hideSelected
    options={[{
        value: '',
        label: 'All'
    }, {
        value: 'popular',
        label: 'Popular
    }]}
    onSelect={value => {
        console.log(value);
    }}
/>
```
