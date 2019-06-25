import * as React from "react";
import { compose } from "recompose";
import InputWithKeyboard from "@components/common/InputWithKeyboard";
import { withMenuAuth } from "@utils/enhancers/menu";
import formHandler from "@utils/enhancers/formHandler";
import { __ } from "@utils/lib/i18n";
import * as styles from "../../Menu/Auth.scss";

const enhance = compose(
  // shouldUpdate(() => false)
  withMenuAuth,
  formHandler
);
const Authorize = enhance(
  ({
    menuId,
    onSuccess,
    onError,
    authorize,
    failed,
    bindInput,
    resetForm,
    formData
  }) => {
    const doAuth = async pin => {
      const authorized = await authorize(menuId, pin);
      if (process.env.NODE_ENV === "development") {
        return onSuccess && onSuccess();
      }
      if (!authorized || !authorized.success) {
        onError && onError();
        resetForm();
        return null;
      }
      onSuccess && onSuccess();
    };
    const onChange = value => {
      if (value.length === 5) {
        doAuth(value);
      }
    };
    return (
      // styles.menuAuth
      <div className={[failed ? styles.failed : ""].join(" ")}>
        <InputWithKeyboard
          name="pin"
          title={__("enter_pin")}
          layout="pin"
          theme={styles}
          initialShow={true}
          {...bindInput({ name: "pin", value: "", onChange })}
        >
          {(value = "") => {
            const mask = value.split("");
            return (
              <div style={{ textAlign: "center" }}>
                {[...Array(5).keys()].map((d, i) => {
                  return (
                    <span
                      style={{
                        display: "inline-block",
                        width: 16,
                        height: 16,
                        margin: 8,
                        borderRadius: "50%",
                        background: mask[i] ? "#555" : "#eee"
                      }}
                      key={i}
                    />
                  );
                })}
              </div>
            );
          }}
        </InputWithKeyboard>
      </div>
    );
  }
);
export default Authorize;
