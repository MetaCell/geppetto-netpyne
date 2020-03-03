import React, { Component } from 'react';
import InputLabel from '@material-ui/core/InputLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

export default class SelectField extends Component{
  constructor (props){
    super(props);
  }

  render () {
    const { id, label, children, ...selectProps } = this.props;
    return <FormControl>
      <InputLabel id={id + '-label'}>{label}</InputLabel>
      <Select
        labelId={id + '-label'}
        id={id}
        error = { !!selectProps.errorText }
        {...selectProps}
      >
        {children}
      </Select>
      {
        selectProps.errorText ? <FormHelperText error> {selectProps.errorText } </FormHelperText> : ''
      }

    </FormControl>;
  }
  
}
