import React, { Component } from 'react';
import './styles/styles.scss';

class Searchable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: props.value || '',
      options: props.options || [],
      optionsVisible: [],
      placeholder: props.placeholder || 'Search',
      notFoundText: props.notFoundText || 'No result found',
      focused: false
    };
    this.onChange = this.onChange.bind(this);
    this.onBlur = this.onBlur.bind(this);
    this.onFocus = this.onFocus.bind(this);
    this.select = this.select.bind(this);
    this.keyDown = this.keyDown.bind(this);
  }

  setValue(value) {}

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

  findAssumption() {
    let { optionsVisible, value } = this.state,
      assume = optionsVisible.find(item => {
        return item.toLowerCase().indexOf(value.toLowerCase()) === 0;
      });
    if (!assume) return;
    this.setState({
      assume: value ? assume : false
    });
  }

  onChange(e) {
    let value = e.target.value,
      optionsVisible = [],
      match = false,
      { options } = this.state;
    optionsVisible = options.filter(item => {
      if (!match)
        match = item.toLowerCase() === value.toLowerCase() ? item : false;
      return item.toLowerCase().indexOf(value.toLowerCase()) >= 0;
    });
    this.props.onSelect && match && this.props.onSelect(match);
    this.setState(
      {
        optionsVisible: value ? optionsVisible.sort() : optionsVisible,
        value: match ? match : value,
        focused: match ? false : true,
        assume: false
      },
      () => {
        this.findAssumption();
      }
    );
  }

  keyDown(e) {
    let { assume } = this.state;
    if (e.keyCode == 9 && assume) {
      e.preventDefault();
      this.props.onSelect && this.props.onSelect(assume);
      this.setState({
        optionsVisible: [],
        value: assume,
        focused: false,
        assume: false
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
      assume: false
    });
  }

  select(value) {
    this.setState(
      {
        value,
        optionsVisible: [],
        focused: false
      },
      () => {
        this.props.onSelect && this.props.onSelect(value);
      }
    );
  }

  render() {
    let {
      value,
      optionsVisible,
      focused,
      placeholder,
      notFoundText,
      assume
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
            placeholder={placeholder}
            onKeyDown={this.keyDown}
            ref={node => (this.input = node)}
          />
          {assume && (
            <span className="searchable-input-assume">
              {assume.split('').map((char, index) => {
                return (
                  <span
                    className={[
                      'searchable-input-assume-char',
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
                    item === value ? 'searchable-list-item__active' : ''
                  ].join(' ')}
                  key={index}
                  onClick={e => {
                    e.stopPropagation();
                    this.select(item);
                  }}
                >
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
