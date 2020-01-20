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
          noInput={true}
          options={[{value: '1', label: '1'}]}
          onSelect={(value) => {
            console.log(value);
          }}
        />
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('root'));
