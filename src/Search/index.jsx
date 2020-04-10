import React, { Component } from 'react';
import './styles/styles.scss';

class Searchable extends Component {
  constructor(props) {
    super(props);
    let value = props.value === '' || props.value ? props.value : false;
    this.state = {
      value,
      selected: value,
      options: props.options || [],
      optionsValues: props.options.map((option) => {
        return option.value;
      }),
      optionsLabels: props.options.map((option) => {
        return option.label;
      }),
      optionsVisible: [],
      placeholder: props.placeholder || 'Search',
      notFoundText: props.notFoundText || 'No result found',
      focused: false,
      arrowPosition: -1,
      noInput: props.noInput || false,
      arrow: props.arrow || false,
      listMaxHeight: props.listMaxHeight || 140,
      multiple: props.multiple || false,
    };
    this.onChange = this.onChange.bind(this);
    this.onBlur = this.onBlur.bind(this);
    this.onFocus = this.onFocus.bind(this);
    this.select = this.select.bind(this);
    this.keyDown = this.keyDown.bind(this);
  }

  componentDidMount() {
    let component = this.root,
      findParent = (e) => {
        if (!e || !e.parentNode) {
          return false;
        }
        if (e == component) {
          return true;
        }
        return findParent(e.parentNode);
      };

    this.documentClick = (e) => {
      if (this.state.focused) {
        if (!findParent(e.target)) this.onBlur();
      }
    };
    document.addEventListener('click', this.documentClick);
    this.findInitialValue();
  }
  componentWillUnmount() {
    document.removeEventListener('click', this.documentClick);
  }

  findInitialValue() {
    let { value, options, multiple } = this.state,
      match = false;
    options.forEach((item) => {
      if (!match) match = item.value === value ? item : false;
    });
    this.setState({
      value: match ? match.label : '',
      selected: match ? match.label : '',
    });
  }

  static getDerivedStateFromProps(props, state) {
    return {
      options: props.options || [],
      optionsValues: props.options.map((option) => {
        return option.value;
      }),
      optionsLabels: props.options.map((option) => {
        return option.label;
      }),
      placeholder: props.placeholder || 'Search',
      notFoundText: props.notFoundText || 'No result found',
      arrow: props.arrow || false,
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
      seconds = optionsVisible.filter((item) => {
        return item.toLowerCase().indexOf(value.toLowerCase()) === 0;
      });
      firsts = seconds.filter((item) => {
        return item.indexOf(value) === 0;
      });
      seconds = seconds.filter((item) => {
        return item.indexOf(value) !== 0;
      });
      optionsVisible = optionsVisible.filter((item) => {
        return item.toLowerCase().indexOf(value.toLowerCase()) !== 0;
      });
      optionsVisible = [...firsts, ...seconds, ...optionsVisible];
    }
    this.setState({
      optionsVisible,
    });
  }

  findAssumption() {
    let { optionsVisible, value } = this.state,
      assume = optionsVisible.find((item) => {
        return item.indexOf(value) === 0;
      }),
      assumeLower = optionsVisible.find((item) => {
        return item.toLowerCase().indexOf(value.toLowerCase()) === 0;
      });
    if (!assume && !assumeLower) return;
    this.setState({
      assume: value ? (assume ? assume : assumeLower) : false,
    });
  }

  buildList(value) {
    let { optionsLabels } = this.state,
      optionsVisible = optionsLabels.filter((item) => {
        return item.toLowerCase().indexOf(value.toLowerCase()) >= 0;
      });
    this.setState(
      {
        value,
        optionsVisible,
        focused: true,
        assume: false,
        arrowPosition: -1,
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
      this.setState(
        {
          value,
          arrowPosition,
          assume,
        },
        this.scrollList
      );
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
      this.setState(
        {
          value,
          arrowPosition,
          assume,
        },
        this.scrollList
      );
    }
  }

  scrollList() {
    let { list } = this,
      { arrowPosition } = this.state,
      target = '.searchable-list-item__' + arrowPosition;
    if (list) {
      let item = list.querySelector(target);
      item && item.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }

  onFocus() {
    let { optionsLabels, optionsVisible } = this.state;
    this.input && this.input.focus();
    this.setState({
      focused: true,
      optionsVisible: optionsVisible.length ? optionsVisible : optionsLabels,
    });
  }

  onBlur() {
    let { value, optionsLabels } = this.state,
      match = false;
    optionsLabels.forEach((item) => {
      if (!match)
        match = item.toLowerCase() === value.toLowerCase() ? item : false;
    });
    this.setState({
      focused: false,
      optionsVisible: [],
      value: match ? match : '',
      assume: false,
      arrowPosition: -1,
    });
  }

  select(value) {
    let { optionsLabels, optionsValues, options, selected } = this.state,
      newSelected =
        optionsLabels.find((item) => {
          return item === value;
        }) || '',
      newSelectedLower =
        optionsLabels.find((item) => {
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
        assume: false,
      },
      () => {
        selected !== newSelected &&
          this.props.onSelect &&
          this.props.onSelect(
            options.find((item) => {
              return item.label === newSelected;
            }) || false
          );
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
      selected,
      noInput,
      arrow,
      listMaxHeight,
      multiple,
    } = this.state;
    return (
      <div
        className={['searchable', focused ? 'searchable__active' : ''].join(
          ' '
        )}
        ref={(node) => (this.root = node)}
      >
        <div
          className={[
            'searchable-input',
            focused ? 'searchable-input__active' : '',
          ].join(' ')}
        >
          <div
            className="searchable-input-control"
            onClick={(e) => {
              let action = !noInput
                ? this.onFocus
                : focused
                ? this.onBlur
                : this.onFocus;
              action();
            }}
          >
            <input
              type="text"
              onChange={this.onChange}
              value={value}
              placeholder={!assume ? placeholder : ''}
              onKeyDown={this.keyDown}
              ref={(node) => (this.input = node)}
              readOnly={noInput}
            />
            {assume && (
              <span className="searchable-input-control-assume">
                {assume.split('').map((char, index) => {
                  return (
                    <span
                      key={char + index}
                      className={[
                        'searchable-input-control-assume-char',
                        char === char.toUpperCase()
                          ? 'searchable-input-control-assume-char__upper'
                          : 'searchable-input-control-assume-char__lower',
                        index <= value.length - 1
                          ? 'searchable-input-control-assume-char__hidden'
                          : '',
                      ].join(' ')}
                    >
                      {index <= value.length - 1 ? value[index] : char}
                    </span>
                  );
                })}
              </span>
            )}
          </div>
          <div
            className="searchable-input-arrow"
            onClick={(e) => {
              let action = focused ? this.onBlur : this.onFocus;
              action();
            }}
          >
            <button className="searchable-input-arrow-inner">
              {arrow ? (
                arrow
              ) : (
                <svg viewBox="0 0 330 330">
                  <path
                    d="M325.607,79.393c-5.857-5.857-15.355-5.858-21.213,0.001l-139.39,139.393L25.607,79.393
c-5.857-5.857-15.355-5.858-21.213,0.001c-5.858,5.858-5.858,15.355,0,21.213l150.004,150c2.813,2.813,6.628,4.393,10.606,4.393
s7.794-1.581,10.606-4.394l149.996-150C331.465,94.749,331.465,85.251,325.607,79.393z"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
        <div
          ref={(node) => (this.list = node)}
          className={[
            'searchable-list',
            focused ? 'searchable-list__visible' : '',
          ].join(' ')}
          style={{
            maxHeight: listMaxHeight,
          }}
        >
          {optionsVisible.length ? (
            optionsVisible.map((item, index) => {
              return (
                <div
                  className={[
                    'searchable-list-item',
                    'searchable-list-item__' + index,
                    item === selected ? 'searchable-list-item__active' : '',
                    arrowPosition >= 0 && index === arrowPosition
                      ? 'searchable-list-item__arrow-position'
                      : '',
                  ].join(' ')}
                  key={index}
                  onClick={(e) => {
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
