import styled from 'styled-components';

const Content = styled.div``;

const CenteredRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
`;

const Column66 = styled.div`
  flex: 0 0 66.66666%;
`;

const InputGroup = styled.div`
  position: relative;
  display: flex;
  width: 100%;
`;

const HelpBlock = styled.p`
  margin-top: 0;
`;

const InputGroupAddon = styled.span`
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 0.5rem 0.75rem;
  margin-bottom: 0;
  font-size: 0.875rem;
  font-weight: normal;
  line-height: 1.25;
  color: #607d8b;
  text-align: center;
  background-color: #cfd8dc;
  border: 1px solid rgba(0, 0, 0, 0.15);
  min-width: 10px;
  white-space: nowrap;
  vertical-align: middle;
  &:not(:last-child) {
    border-right: 0;
  }
`;

const FormContorl = styled.input`
  display: block;
  width: 100%;
  padding: 0.5rem 0.75rem;
  font-size: 0.875rem;
  line-height: 1.25;
  color: #607d8b;
  background-color: #fff;
  background-image: none;
  background-clip: padding-box;
  border: 1px solid;
  border-radius: 0;
  transition: border-color ease-in-out 0.15s, box-shadow ease-in-out 0.15s;
  border-color: ${props => props.error ? 'red' : 'rgba(0, 0, 0, 0.15)'};
`;

const CardGroup = styled.div`
  display: flex;
  flex-flow: row wrap;
`;

const Cover = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.4);
  z-index: 3;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

export {
  Content,
  CenteredRow,
  Column66,
  InputGroup,
  HelpBlock,
  InputGroupAddon,
  FormContorl,
  CardGroup,
  Cover
};
