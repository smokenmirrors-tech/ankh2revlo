import React from 'react';
import styled from 'styled-components';
import FontAwesome from 'react-fontawesome';
import { InputGroup, InputGroupAddon, FormContorl } from './Common';

const Wrapper = styled.div``;

const Input = (props) => (
  <Wrapper>
    <InputGroup>
      <InputGroupAddon><FontAwesome name={props.iconName}/></InputGroupAddon>
      <FormContorl error={props.error} type="text" placeholder={props.placeholder} value={props.value} onChange={(e) => props.onChange(e.target.value)}/>
    </InputGroup>
    {props.help}
  </Wrapper>
);

export default Input;
