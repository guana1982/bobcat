import * as React from "react";
import { compose, lifecycle } from "recompose";
import Vendor from "../../VendorComponents";

const fullScreen = compose(
  lifecycle({
    componentDidMount() {
      document.body.webkitRequestFullScreen();
    },
    componentDidCatch(err) {
      console.log("!!!!! catch", err);
    }
  }),
);

export default fullScreen(({
  isLoadingNetwork,
  error,
  getConfigState,
  ...props
}) => {
  return (
    <React.Fragment>
      <Vendor />
    </React.Fragment>
  );
});
