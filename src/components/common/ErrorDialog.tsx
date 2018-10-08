import * as React from "react";
import { __ } from "../../utils/lib/i18n";
import withErrorDialog from "../../utils/enhancers/errorDialog";

export default withErrorDialog(({ message, close, show }) => {
  if (!show) return null;
  return (
    <div
      style={{
        padding: "1em",
        background: "#fff",
        border: "4px solid #0034B0",
        borderRadius: 16,
        position: "absolute",
        top: "50%",
        minHeight: 200,
        transform: "translate(-50%, -50%)",
        width: 480,
        left: "50%",
        zIndex: 9999,
        textAlign: "center"
      }}
    >
      <h3>{__("Error")}</h3>
      {__(message)}
      <p>{__("(touch to continue)")}</p>
    </div>
  );
});
