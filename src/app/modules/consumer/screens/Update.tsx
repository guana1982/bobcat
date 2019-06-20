import * as React from "react";

import styled from "styled-components";
import Loader from "react-loader-spinner";
import { ConfigContext } from "@core/containers";

export const UpdateContent = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100vw;
  height: 100vh;
`;

interface StatusUpdate {
  percentage?: number;
  message?: string;
}

interface UpdateProps {
  history: any;
}

export const Update = (props: UpdateProps) => {

  const [statusUpdate, setStatusUpdate] = React.useState<StatusUpdate>({});

  const configConsumer = React.useContext(ConfigContext);

  const { socketUpdate$ } = configConsumer;

  React.useEffect(() => {
    const socketUpdate_ = socketUpdate$
    .subscribe(
      (value: StatusUpdate) => {
        setStatusUpdate(value);
        if (value.percentage === 100) {
          setTimeout(() => window.location.reload(), 2000);
        }
      }
    );
    return () => {
      socketUpdate_.unsubscribe();
    };
  }, []);

  return (
    <UpdateContent>
      <br /><br /><br /><br /><br />
      <Loader
        type="Grid"
        color="#BCBCBC"
        height="150"
        width="150"
      />
      <br /><br />
      <h1>{statusUpdate.message}</h1>
    </UpdateContent>
  );

};