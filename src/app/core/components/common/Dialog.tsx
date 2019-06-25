import * as React from "react";
import { compose, setDisplayName } from "recompose";
import withErrorDialog from "@utils/enhancers/errorDialog";

const enhance = compose(setDisplayName("Dialog"), withErrorDialog);

export default enhance(({ title, message }) => {
  return (
    <div
      style={{
        padding: "1em",
        background: "#fff",
        border: "4px solid #0034B0",
        borderRadius: 4,
        position: "absolute",
        top: "50%",
        height: 200,
        marginTop: -100,
        width: 300,
        left: "50%",
        marginLeft: -150,
        zIndex: 9999,
        textAlign: "center"
      }}
    >
      <h3>{title}</h3>
      <p>{message}</p>
    </div>
  );
});
