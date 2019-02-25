import * as React from "react";
import styled, { keyframes } from "styled-components";

const CleaningContent = styled.div`
  width: 100vw;
  height: calc(100vh - 115px);
`;

interface CleaningProps {}

interface CleaningState {}

const CleaningComponent = (props: CleaningProps) => {

  const [state, setState] = React.useState<CleaningState>({});

  React.useEffect(() => {
    console.log("open");
    return () => {
      console.log("close");
    };
  }, []);

  return (
    <CleaningContent>
      <h1>Cleaning</h1>
    </CleaningContent>
  );
};

export default CleaningComponent;
