import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Searchable from '../package';
import './styles.scss';
class App extends Component {
  constructor() {
    super();
  }
  render() {
    return (
      <div className="wrap">
        <div className="wrap-col">
          <Searchable
            multiple
            noInput
            options={[
              { value: '', label: 'All' },
              { value: 'popular', label: 'Popular' },
              { value: 'favorites', label: 'Favorites' },
            ]}
            onSelect={(option) => {
              console.log(option);
            }}
          />
        </div>
        <div className="wrap-col">
          <Searchable
            value={['', 'popular']}
            multiple
            noInput
            options={[
              { value: '', label: 'All' },
              { value: 'popular', label: 'Popular' },
              { value: 'favorites', label: 'Favorites' },
            ]}
            onSelect={(option) => {
              console.log(option);
            }}
          />
        </div>
        <div className="wrap-col">
          <Searchable
            value={['', 'popular']}
            multiple
            hideSelected
            options={[
              { value: '', label: 'All' },
              { value: 'popular', label: 'Popular' },
              { value: 'favorites', label: 'Favorites' },
            ]}
            onSelect={(option) => {
              console.log(option);
            }}
          />
        </div>
        <div className="wrap-col">
          <Searchable
            noInput
            placeholder={'Choose'}
            options={[
              { value: '', label: 'All' },
              { value: 'popular', label: 'Popular' },
              { value: 'favorites', label: 'Favorites' },
            ]}
            onSelect={(option) => {
              console.log(option);
            }}
          />
        </div>
        <div className="wrap-col">
          <Searchable
            value={''}
            options={[
              { value: '', label: 'All' },
              { value: 'popular', label: 'Popular' },
              { value: 'favorites', label: 'Favorites' },
            ]}
            onSelect={(option) => {
              console.log(option);
            }}
          />
        </div>
        <div className="wrap-col">
          <Searchable
            value={''}
            disabled
            options={[
              { value: '', label: 'All' },
              { value: 'popular', label: 'Popular' },
              { value: 'favorites', label: 'Favorites' },
            ]}
            onSelect={(option) => {
              console.log(option);
            }}
          />
        </div>
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('root'));
