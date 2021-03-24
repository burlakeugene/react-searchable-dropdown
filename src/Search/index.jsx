import React, { Component } from 'react';
import './styles/styles.scss';

const icons = {
  arrow: (
    <svg viewBox="0 0 330 330">
      <path
        d="M325.607,79.393c-5.857-5.857-15.355-5.858-21.213,0.001l-139.39,139.393L25.607,79.393
c-5.857-5.857-15.355-5.858-21.213,0.001c-5.858,5.858-5.858,15.355,0,21.213l150.004,150c2.813,2.813,6.628,4.393,10.606,4.393
s7.794-1.581,10.606-4.394l149.996-150C331.465,94.749,331.465,85.251,325.607,79.393z"
      />
    </svg>
  ),
  remove: (
    <svg viewBox="0 0 512.001 512.001">
      <path
        d="M294.111,256.001L504.109,46.003c10.523-10.524,10.523-27.586,0-38.109c-10.524-10.524-27.587-10.524-38.11,0L256,217.892
			L46.002,7.894c-10.524-10.524-27.586-10.524-38.109,0s-10.524,27.586,0,38.109l209.998,209.998L7.893,465.999
			c-10.524,10.524-10.524,27.586,0,38.109c10.524,10.524,27.586,10.523,38.109,0L256,294.11l209.997,209.998
			c10.524,10.524,27.587,10.523,38.11,0c10.523-10.524,10.523-27.586,0-38.109L294.111,256.001z"
      />
    </svg>
  ),
};

class Searchable extends Component {
  constructor(props) {
    super(props);
    let value = (() => {
        if (!props.multiple) {
          return props.value === 0 || props.value === '' || props.value
            ? props.value
            : false;
        } else {
          return Array.isArray(props.value) ? props.value : [];
        }
      })(),
      search = (() => {
        if (!props.multiple) {
          let option = props.options.find((option) => {
            return option.value === value;
          });
          return option ? option.label : '';
        } else {
          return '';
        }
      })();
    this.state = {
      value,
      options: props.options,
      optionsVisible: [],
      search,
      assume: '',
      multiple: props.multiple,
      disabled: props.disabled || false,
      placeholder: props.placeholder || 'Search',
      notFoundText: props.notFoundText || 'No result found',
      noInput: props.noInput || false,
      hideSelected: props.hideSelected || false,
      opened: false,
      arrow: {
        position: -1,
      },
      listMaxHeight: props.listMaxHeight || 140,
    };
    this.onFocus = this.onFocus.bind(this);
    this.onBlur = this.onBlur.bind(this);
    this.onChange = this.onChange.bind(this);
    this.keyDown = this.keyDown.bind(this);
  }

  componentDidMount() {
    let component = this.container,
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
      if (this.state.opened) {
        if (!findParent(e.target)) this.onBlur();
      }
    };
    document.addEventListener('click', this.documentClick);
  }
  componentWillUnmount() {
    document.removeEventListener('click', this.documentClick);
  }

  static getDerivedStateFromProps(props, state) {
    return {
      options: props.options || state.options,
      placeholder: props.placeholder || state.placeholder,
      notFoundText: props.notFoundText || state.notFoundText,
      disabled: props.disabled || false,
      hideSelected: props.hideSelected || false,
    };
  }

  removeFromValue(toRemove) {
    let { value } = this.state;
    this.setState(
      {
        value: value.filter((value) => {
          return value !== toRemove;
        }),
      },
      () => {
        this.onBlur();
        this.afterChange();
      }
    );
  }

  afterChange() {
    let { value } = this.state;
    this.props.onSelect && this.props.onSelect(value);
  }

  onBlur() {
    let { value, options, arrow, multiple } = this.state;
    arrow.position = -1;
    let obj = {
      optionsVisible: [],
      assume: false,
      opened: false,
      arrow,
      search: '',
    };
    if (!multiple) {
      let option = options.find((option) => {
        return option.value === value;
      });
      obj.search = option ? option.label : '';
    }
    this.setState(obj);
  }

  onFocus() {
    let { disabled } = this.state;
    if (disabled) return;
    this.input && this.input.focus();
    this.setState({
      opened: true,
      optionsVisible: this.getOptionsVisible({
        ignoreSearch: true,
      }),
    });
  }

  select(option) {
    let { value, multiple } = this.state,
      changed = false;
    if (!multiple) {
      if (value !== option.value) changed = true;
      value = option.value;
    } else {
      if (value.indexOf(option.value) < 0) {
        value.push(option.value);
        changed = true;
      }
    }
    this.setState(
      {
        value,
      },
      () => {
        this.onBlur();
        if (changed) {
          this.afterChange();
        }
      }
    );
  }

  keyDown(e) {
    let { assume = '', arrow, search, optionsVisible, opened } = this.state;
    if (opened && (e.keyCode == 9 || e.keyCode == 13) && assume) {
      e.preventDefault();
      this.select(assume);
    }

    if ((!opened && e.keyCode == 13) || e.keyCode == 40 || e.keyCode == 38) {
      e.preventDefault();
      this.onFocus();
    }

    if (e.keyCode == 27 || (e.keyCode == 13 && !assume && opened)) {
      e.preventDefault();
      this.onBlur();
    }

    if (e.keyCode == 40 && optionsVisible.length) {
      e.preventDefault();
      if (arrow.position < optionsVisible.length - 1) {
        arrow.position++;
      } else {
        arrow.position = 0;
      }
      let assume = optionsVisible[arrow.position];
      search = assume.label.slice(0, search.length);
      this.setState(
        {
          search,
          arrow,
          assume,
        },
        this.scrollList
      );
    }

    if (e.keyCode == 38 && optionsVisible.length) {
      e.preventDefault();
      if (arrow.position <= 0) {
        arrow.position = optionsVisible.length - 1;
      } else {
        arrow.position--;
      }
      let assume = optionsVisible[arrow.position];
      search = assume.label.slice(0, search.length);
      this.setState(
        {
          search,
          arrow,
          assume,
        },
        this.scrollList
      );
    }
  }

  onChange(event) {
    let { arrow, optionsVisible, opened } = this.state,
      { target } = event,
      { value } = target;
    arrow.position = -1;
    this.setState(
      {
        search: value,
        arrow,
        opened: true,
      },
      () => {
        let match = optionsVisible.find((option) => {
          return option.label.toLowerCase() === value.toLowerCase();
        });
        if (match) {
          this.select(match);
        } else {
          this.sort();
        }
      }
    );
  }

  scrollList() {
    let { list } = this,
      { arrow } = this.state,
      target = '.searchable__list__item--' + arrow.position;
    if (list) {
      let item = list.querySelector(target);
      item && item.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }

  getOptionsVisible({ ignoreSearch = false } = {}) {
    let {
        hideSelected,
        multiple,
        value,
        options,
        optionsVisible,
        search,
      } = this.state,
      result = options.filter((option) => {
        return ignoreSearch
          ? option
          : option.label.toLowerCase().indexOf(search.toLowerCase()) >= 0;
      });
    if (hideSelected) {
      if (!multiple) {
        result = result.filter((option) => {
          return option.value !== value;
        });
      } else {
        result = result.filter((option) => {
          return value.indexOf(option.value) < 0;
        });
      }
    }
    return result;
  }

  sort() {
    let { search } = this.state,
      firsts = [],
      seconds = [],
      options = this.getOptionsVisible();
    if (search) {
      options = options.sort((a, b) => {
        return a.label.toLowerCase().localeCompare(b.label.toLowerCase());
      });
      seconds = options.filter((item) => {
        return item.label.toLowerCase().indexOf(search.toLowerCase()) === 0;
      });
      firsts = seconds.filter((item) => {
        return item.label.indexOf(search) === 0;
      });
      seconds = seconds.filter((item) => {
        return item.label.indexOf(search) !== 0;
      });
      options = options.filter((item) => {
        return item.label.toLowerCase().indexOf(search.toLowerCase()) !== 0;
      });
      options = [...firsts, ...seconds, ...options];
    }
    this.setState(
      {
        optionsVisible: options,
      },
      () => {
        this.findAssumption();
      }
    );
  }

  findAssumption() {
    let { optionsVisible, search } = this.state,
      result = false,
      assume = optionsVisible.find((item) => {
        return item.label.indexOf(search) === 0;
      }),
      assumeLower = optionsVisible.find((item) => {
        return item.label.toLowerCase().indexOf(search.toLowerCase()) === 0;
      });
    if (search && (assume || assumeLower)) result = assume || assumeLower;
    this.setState({
      assume: result,
    });
  }

  render() {
    let {
      search,
      value,
      multiple,
      disabled,
      options,
      optionsVisible,
      noInput,
      assume,
      opened,
      placeholder,
      arrow,
      listMaxHeight,
      notFoundText,
    } = this.state;
    return (
      <div
        className={[
          'searchable',
          opened ? 'searchable--active' : '',
          disabled ? 'searchable--disabled' : '',
          multiple ? 'searchable--multiple' : '',
        ].join(' ')}
        ref={(node) => (this.container = node)}
      >
        <div
          className="searchable__controls"
          onClick={(e) => {
            let action = !noInput
              ? this.onFocus
              : opened
              ? this.onBlur
              : this.onFocus;
            action();
          }}
        >
          <div className="searchable__controls__list-input">
            {multiple ? (
              <div className="searchable__controls__list">
                {value.map((value, index) => {
                  return (
                    <div
                      className="searchable__controls__list__item"
                      key={index}
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                    >
                      {
                        options.find((option) => {
                          return option.value === value;
                        }).label
                      }
                      <button
                        onClick={() => {
                          this.removeFromValue(value);
                        }}
                        className="searchable__controls__list__item__remove"
                      >
                        {icons['remove']}
                      </button>
                    </div>
                  );
                })}
              </div>
            ) : null}
            {multiple && noInput && !value.length && (
              <div className="searchable__controls__placeholder">
                {placeholder}
              </div>
            )}
            <div
              className={[
                'searchable__controls__input',
                multiple && noInput
                  ? 'searchable__controls__input--hidden'
                  : '',
              ].join(' ')}
            >
              <input
                type="text"
                value={search}
                placeholder={!assume ? placeholder : ''}
                onChange={(e) => {
                  this.onChange(e);
                }}
                onKeyDown={this.keyDown}
                ref={(node) => (this.input = node)}
                readOnly={noInput}
                disabled={disabled}
              />

              {assume && (
                <span className="searchable__controls__input__assume">
                  {assume.label.split('').map((char, index) => {
                    return (
                      <span
                        key={char + index}
                        className={[
                          'searchable__controls__input__assume__char',
                          char === char.toUpperCase()
                            ? 'searchable__controls__input__assume__char--upper'
                            : 'searchable__controls__input__assume__char--lower',
                          index <= search.length - 1
                            ? 'searchable__controls__input__assume__char--hidden'
                            : '',
                        ].join(' ')}
                      >
                        {index <= search.length - 1 ? search[index] : char}
                      </span>
                    );
                  })}
                </span>
              )}
            </div>
          </div>
          <div
            className="searchable__controls__arrow"
            onClick={(e) => {
              e.stopPropagation();
              let action = opened ? this.onBlur : this.onFocus;
              action();
            }}
          >
            <button className="searchable__controls__arrow__inner">
              {icons['arrow']}
            </button>
          </div>
        </div>
        {optionsVisible.length && opened ? (
          <div
            className="searchable__list"
            ref={(node) => (this.list = node)}
            style={{
              maxHeight: listMaxHeight,
            }}
          >
            {optionsVisible.map((option, index) => {
              let isArrow = arrow.position >= 0 && index === arrow.position,
                isActive = !multiple
                  ? value === option.value
                  : value.indexOf(option.value) >= 0;
              return (
                <div
                  key={index}
                  className={[
                    'searchable__list__item',
                    'searchable__list__item--' + index,
                    isActive ? 'searchable__list__item--active' : '',
                    isArrow ? 'searchable__list__item--arrow-position' : '',
                  ].join(' ')}
                  onClick={(e) => {
                    e.stopPropagation();
                    this.select(option);
                  }}
                >
                  {isArrow && (
                    <i className="searchable__list__item__arrow">
                      <svg viewBox="0 0 240.823 240.823">
                        <path
                          d="M183.189,111.816L74.892,3.555c-4.752-4.74-12.451-4.74-17.215,0c-4.752,4.74-4.752,12.439,0,17.179
		l99.707,99.671l-99.695,99.671c-4.752,4.74-4.752,12.439,0,17.191c4.752,4.74,12.463,4.74,17.215,0l108.297-108.261
		C187.881,124.315,187.881,116.495,183.189,111.816z"
                        />
                      </svg>
                    </i>
                  )}
                  {option.label}
                </div>
              );
            })}
          </div>
        ) : null}
        {!optionsVisible.length && opened ? (
          <div className="searchable__list searchable__list--empty">
            {notFoundText}
          </div>
        ) : null}
      </div>
    );
  }
}

export default Searchable;
