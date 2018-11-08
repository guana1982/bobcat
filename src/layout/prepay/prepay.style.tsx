import styled from "styled-components";


/* ==== COMPONENTS ==== */
/* ======================================== */

export const QrSquare = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  margin: auto;
  top: 85px;
  width: 230px;
  height: 230px;
  border: 2px solid white;
  z-index: 99;
`;

export const Webcam = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  width: 270px;
  height: 270px;
  margin-left: -135px;
  margin-top: -135px;
  background-color: #0000ff;
`;

/* ==== LAYOUT ==== */
/* ======================================== */

export const Header = styled.div`
  padding: 1.5rem;
  display: flex;
`;

interface InfoContentProps { textColor?: string; }
export const InfoContent = styled<InfoContentProps, "div">("div")`
  text-align: center;
  position: absolute;
  bottom: 80px;
  width: 100%;
  h2 {
    color: ${props => props.textColor || "black"};
  }
  button {
    padding: 10px;
    border: 1px solid gray;
  }
`;

export const ScreenContent = styled.div`
  position: absolute;
  width: 600px;
  height: 400px;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;
  color: white;
  text-align: center;
  h2 {
    color: ${props => props.theme.primary};
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