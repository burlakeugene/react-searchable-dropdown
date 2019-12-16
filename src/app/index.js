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
          options={['USDCAD', 'CADUSD', 'USDEUR', 'SD', 'GF', 'SDSA']}
          onSelect={(value) => {
            console.log(value);
          }}
        />
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('root'));
