import styled from "styled-components";


export const Footer = styled.div`
  position: absolute;
  bottom: 0;
  width: 100%;
  display: flex;
  justify-content: flex-end;
  padding: 2rem;
  h2 {
    color: ${props => props.theme.primary};
  }
`;