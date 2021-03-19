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
        if (!props.muliple) {
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
      search,
      assume: '',
      multiple: props.multiple,
      disabled: props.disabled || false,
      placeholder: props.placeholder || 'Search',
      notFoundText: props.notFoundText || 'No result found',
      focused: false,
      arrowPosition: -1,
      noInput: props.noInput || false,
      arrow: {
        position: -1,
      },
      listMaxHeight: props.listMaxHeight || 140,
    };
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
      if (this.state.focused) {
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
      focused: props.disabled && state.focused ? false : state.focused,
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
        this.onChange();
      }
    );
  }

  onChange() {
    let { value } = this.state;
    this.props.onSelect && this.props.onSelect(value);
  }

  onBlur() {
    let { value, options } = this.state;
    this.setState({
      focused: false,
      assume: false,
      arrowPosition: -1,
    });
  }

  render() {
    let { search, value, focused, multiple, disabled, options } = this.state;
    return (
      <div
        className={[
          'searchable',
          focused ? 'searchable--active' : '',
          disabled ? 'searchable--disabled' : '',
          multiple ? 'searchable--multiple' : '',
        ].join(' ')}
        ref={(node) => (this.container = node)}
      >
        <div className="searchable__controls">
          <div className="searchable__controls__list-input">
            {multiple ? (
              <div className="searchable__controls__list">
                {value.map((value) => {
                  return (
                    <div className="searchable__controls__list__item">
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
          </div>
          <div className="searchable__controls__arrow">{icons['arrow']}</div>
        </div>
      </div>
    );
  }
}

export default Searchable;
