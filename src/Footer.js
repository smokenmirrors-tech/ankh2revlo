import React from 'react';
import styled from 'styled-components';
import FontAwesome from 'react-fontawesome';

const Wrapper = styled.div``;
const Copy = styled.div``;

const Footer = (props) => (
  <Wrapper>
    <Copy>
      <p>Made with <FontAwesome name="heart" /> by Smoke & Mirrors Technologies.</p>
    </Copy>
  </Wrapper>
);

export default Footer;
