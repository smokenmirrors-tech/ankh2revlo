import React from 'react';
import styled from 'styled-components';
import FontAwesome from 'react-fontawesome';
import { InputGroup, InputGroupAddon, FormContorl } from './Common';

const Wrapper = styled.div``;

const FileInput = (props) => (
  <Wrapper>
    <InputGroup>
      <InputGroupAddon><FontAwesome name={props.iconName}/></InputGroupAddon>
      <FormContorl error={props.error} type="text" placeholder={props.placeholder} value={props.value} onClick={() => props.onClick()}/>
      <input className="file-control" type="file" ref={(el) => props.fpRef(el)} accept=".sqlite" onChange={(e) => props.onChange(e)} />
    </InputGroup>
    {props.help}
  </Wrapper>
);

export default FileInput;
