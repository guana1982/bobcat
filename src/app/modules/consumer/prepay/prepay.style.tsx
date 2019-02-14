import styled from "styled-components";


/* ==== COMPONENTS ==== */
/* ======================================== */

export const QrSquare = styled.div`
  position: relative;
  margin: auto;
  margin-top: 50px;
  width: 250px;
  height: 250px;
  z-index: 99;
  &:before {
      display: block;
      content: "";
      width: 4rem;
      height: 4rem;
      position: absolute;
      top: 0;
      left: 0;
      border-top: .3rem solid #fff;
      border-left: .3rem solid #fff;
  }
  &:after {
      display: block;
      content: "";
      width: 4rem;
      height: 4rem;
      position: absolute;
      top: 0;
      right: 0;
      border-top: .3rem solid #fff;
      border-right: .3rem solid #fff;
  }
  span:before {
      display: block;
      content: "";
      width: 4rem;
      height: 4rem;
      position: absolute;
      bottom: 0;
      left: 0;
      border-bottom: .3rem solid #fff;
      border-left: .3rem solid #fff;
  }
  span:after {
      display: block;
      content: "";
      width: 4rem;
      height: 4rem;
      position: absolute;
      bottom: 0;
      right: 0;
      border-bottom: .3rem solid #fff;
      border-right: .3rem solid #fff;
  }
`;

export const Webcam = styled.div`
  width: 350px;
  height: 350px;
  background-color: #0000ff;
`;

/* ==== LAYOUT ==== */
/* ======================================== */

export const Header = styled.div`
  display: flex;
  justify-content: flex-end;
  padding: 1.5rem;
`;

export const SectionContent = styled.div`
  display: flex;
  width: 100%;
  height: calc(100% - 7.5rem);
`;

export const SectionWrap = styled.div`
  position: relative;
  width: 50%;
  display: flex;
  align-items: center;
  flex-direction: column;
  &:nth-child(2) {
    justify-content: space-around;
  }
  ${Webcam} {
    margin-top: 3rem;
  }
  h1, h2 {
    color: ${props => props.theme.primary};
    font-weight: 600;
    white-space: pre-wrap;
    text-align: center;
  }
  h2 { font-size: 2rem; }
  h1 { font-size: 2.2rem; }
  img {
    &#banner {
      width: 15rem;
    }
    &#icon {
      width: 4rem;
    }
  }
`;

/* ==== HOME MAIN ==== */
/* ======================================== */

export const PrepayContent = styled.div`
  background-color: ${props => props.theme.secondary};
  width: 100vw;
  height: 100vh;
  position: absolute;
  top: 0;
  left: 0;
`;