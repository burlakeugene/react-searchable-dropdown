import React, { Component } from 'react';
import './styles/styles.scss';

class Searchable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: props.value || '',
      selected: props.value || '',
      options: props.options || [],
      optionsVisible: [],
      placeholder: props.placeholder || 'Search',
      notFoundText: props.notFoundText || 'No result found',
      focused: false,
      arrowPosition: -1
    };
    this.onChange = this.onChange.bind(this);
    this.onBlur = this.onBlur.bind(this);
    this.onFocus = this.onFocus.bind(this);
    this.select = this.select.bind(this);
    this.keyDown = this.keyDown.bind(this);
  }

  componentDidMount() {
    document.addEventListener('click', this.onBlur);
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.onBlur);
  }

  static getDerivedStateFromProps(props, state) {
    return {
      options: props.options || [],
      placeholder: props.placeholder || 'Search',
      notFoundText: props.notFoundText || 'No result found'
    };
  }

  sort() {
    let { value, optionsVisible } = this.state,
      firsts = [],
      seconds = [];
    if (value) {
      optionsVisible = optionsVisible.sort((a, b) => {
        return a.toLowerCase().localeCompare(b.toLowerCase());
      });
      seconds = optionsVisible.filter(item => {
        return item.toLowerCase().indexOf(value.toLowerCase()) === 0;
      });
      firsts = seconds.filter(item => {
        return item.indexOf(value) === 0;
      });
      seconds = seconds.filter(item => {
        return item.indexOf(value) !== 0;
      });
      optionsVisible = optionsVisible.filter(item => {
        return item.toLowerCase().indexOf(value.toLowerCase()) !== 0;
      });
      optionsVisible = [...firsts, ...seconds, ...optionsVisible];
    }
    this.setState({
      optionsVisible
    });
  }

  findAssumption() {
    let { optionsVisible, value } = this.state,
      assume = optionsVisible.find(item => {
        return item.indexOf(value) === 0;
      }),
      assumeLower = optionsVisible.find(item => {
        return item.toLowerCase().indexOf(value.toLowerCase()) === 0;
      });
    if (!assume && !assumeLower) return;
    this.setState({
      assume: value ? (assume ? assume : assumeLower) : false
    });
  }

  buildList(value) {
    let { options } = this.state,
      optionsVisible = options.filter(item => {
        return item.toLowerCase().indexOf(value.toLowerCase()) >= 0;
      });
    this.setState(
      {
        value,
        optionsVisible,
        focused: true,
        assume: false,
        arrowPosition: -1
      },
      () => {
        this.sort();
        this.findAssumption();
      }
    );
  }

  onChange(e) {
    let value = e.target.value;
    if (!this.select(value)) this.buildList(value);
  }

  keyDown(e) {
    let { assume = '', arrowPosition, optionsVisible, value } = this.state;

    if ((e.keyCode == 9 || e.keyCode == 13) && assume) {
      e.preventDefault();
      this.select(assume);
    }

    if (e.keyCode == 40) {
      e.preventDefault();
      if (arrowPosition < optionsVisible.length - 1) {
        arrowPosition++;
      } else {
        arrowPosition = 0;
      }
      let assume = optionsVisible[arrowPosition];
      value = assume.slice(0, value.length);
      this.setState({
        value,
        arrowPosition,
        assume
      });
    }

    if (e.keyCode == 38) {
      e.preventDefault();
      if (arrowPosition <= 0) {
        arrowPosition = optionsVisible.length - 1;
      } else {
        arrowPosition--;
      }
      let assume = optionsVisible[arrowPosition];
      value = assume.slice(0, value.length);
      this.setState({
        value,
        arrowPosition,
        assume
      });
    }
  }

  onFocus() {
    let { options, optionsVisible } = this.state;
    this.input && this.input.focus();
    this.setState({
      focused: true,
      optionsVisible: optionsVisible.length ? optionsVisible : options
    });
  }

  onBlur() {
    let { value, options } = this.state,
      match = false;
    options.forEach(item => {
      if (!match)
        match = item.toLowerCase() === value.toLowerCase() ? item : false;
    });
    this.setState({
      focused: false,
      optionsVisible: [],
      value: match ? match : '',
      assume: false,
      arrowPosition: -1
    });
  }

  select(value) {
    let { options, selected } = this.state,
      newSelected =
        options.find(item => {
          return item === value;
        }) || '',
      newSelectedLower =
        options.find(item => {
          return item.toLowerCase() === value.toLowerCase();
        }) || '';
    newSelected = newSelected ? newSelected : newSelectedLower;
    this.setState(
      {
        selected: newSelected,
        value: newSelected ? newSelected : value,
        optionsVisible: [],
        focused: false,
        arrowPosition: -1,
        assume: false
      },
      () => {
        selected !== newSelected &&
          this.props.onSelect &&
          this.props.onSelect(newSelected);
      }
    );
    return newSelected;
  }

  render() {
    let {
      value,
      optionsVisible,
      focused,
      placeholder,
      notFoundText,
      assume,
      arrowPosition,
      selected
    } = this.state;
    return (
      <div
        className="searchable"
        onClick={e => {
          e.stopPropagation();
          e.nativeEvent.stopImmediatePropagation();
          this.onFocus();
        }}
      >
        <div
          className={[
            'searchable-input',
            focused ? 'searchable-input__active' : ''
          ].join(' ')}
        >
          <input
            type="text"
            onChange={this.onChange}
            value={value}
            placeholder={!assume ? placeholder : ''}
            onKeyDown={this.keyDown}
            ref={node => (this.input = node)}
          />
          {assume && (
            <span className="searchable-input-assume">
              {assume.split('').map((char, index) => {
                return (
                  <span
                    key={char + index}
                    className={[
                      'searchable-input-assume-char',
                      char === char.toUpperCase() ? 'searchable-input-assume-char__upper' : 'searchable-input-assume-char__lower',
                      index <= value.length - 1
                        ? 'searchable-input-assume-char__hidden'
                        : ''
                    ].join(' ')}
                  >
                    {index <= value.length - 1 ? value[index] : char}
                  </span>
                );
              })}
            </span>
          )}

          <div
            className="searchable-input-arrow"
            onClick={e => {
              if (focused) {
                e.stopPropagation();
                this.onBlur();
              }
            }}
          >
            <svg viewBox="0 0 330 330">
              <path
                d="M325.607,79.393c-5.857-5.857-15.355-5.858-21.213,0.001l-139.39,139.393L25.607,79.393
	c-5.857-5.857-15.355-5.858-21.213,0.001c-5.858,5.858-5.858,15.355,0,21.213l150.004,150c2.813,2.813,6.628,4.393,10.606,4.393
	s7.794-1.581,10.606-4.394l149.996-150C331.465,94.749,331.465,85.251,325.607,79.393z"
              />
            </svg>
          </div>
        </div>
        <div
          className={[
            'searchable-list',
            focused ? 'searchable-list__visible' : ''
          ].join(' ')}
        >
          {optionsVisible.length ? (
            optionsVisible.map((item, index) => {
              return (
                <div
                  className={[
                    'searchable-list-item',
                    item === selected ? 'searchable-list-item__active' : '',
                    arrowPosition >= 0 && index === arrowPosition
                      ? 'searchable-list-item__arrow-position'
                      : ''
                  ].join(' ')}
                  key={index}
                  onClick={e => {
                    e.stopPropagation();
                    this.select(item);
                  }}
                >
                  {arrowPosition >= 0 && index === arrowPosition && (
                    <i className="searchable-list-item-arrow">
                      <svg viewBox="0 0 240.823 240.823">
                        <path
                          d="M183.189,111.816L74.892,3.555c-4.752-4.74-12.451-4.74-17.215,0c-4.752,4.74-4.752,12.439,0,17.179
		l99.707,99.671l-99.695,99.671c-4.752,4.74-4.752,12.439,0,17.191c4.752,4.74,12.463,4.74,17.215,0l108.297-108.261
		C187.881,124.315,187.881,116.495,183.189,111.816z"
                        />
                      </svg>
                    </i>
                  )}
                  {item}
                </div>
              );
            })
          ) : (
            <div className="searchable-list-empty">{notFoundText}</div>
          )}
        </div>
      </div>
    );
  }
}

export default Searchable;
