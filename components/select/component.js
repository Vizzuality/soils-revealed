import React from 'react';
import ReactSelect from 'react-select';
import PropTypes from 'prop-types';



const Select = () => {

}


  state = { selectedOption: null }

  options = {
    isSearchable: false,
    theme,
    styles
  }

  constructor(props) {
    super(props);
    this.state = { selectedOption: props.value };
  }

  handleChange = (selectedOption) => {
    const { onChange } = this.props;
    this.setState({ selectedOption });
    onChange(selectedOption.value);
  }

  render() {
    const { value: defaultValue, options, onChange, ...props } = this.props;
    const { selectedOption } = this.state;
    const selectedValue = options.find(opt => opt.value === selectedOption);

    return (
      <ReactSelect
        className={styles.select}
        {...this.options}
        {...props}
        options={options}
        onChange={this.handleChange}
        value={selectedValue}
      />
    );
  }
}

Select.propTypes = {
  options: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func,
};

Select.defaultProps = {
  value: null,
  onChange: () => null,
};

export default Select;
