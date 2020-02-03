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
        <Searchable
          value={''}
          options={[
            { value: '', label: 'All' },
            { value: 'popular', label: 'Popular' },
            { value: 'favorites', label: 'Favorites' }
          ]}
          onSelect={option => {
            console.log(option);
          }}
        />
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('root'));
