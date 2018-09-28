import * as React from "react";
import { compose } from "recompose";
import { __ } from "../../utils/lib/i18n";
import { withSubMenu } from "../../utils/enhancers/menu";
import withFormHandler from "../../utils/enhancers/formHandler";
import Checkbox from "../../components/common/Checkbox";
import Card from "../../components/common/Card";
import Field from "../../components/common/Field";
import InputWithKeyboard from "../../components/common/InputWithKeyboard";
import * as styles from "../../Menu/BeverageConfig.scss";

const enhance = compose(withFormHandler);
const getInitialFormData = submenuElements => {
  return submenuElements.reduce((a, b) => {
    if (!a[b.id]) {
      a[b.id] = b;
    }
    return a;
  }, {});
};
const onSave = saveValues => formData => () => {
  const values = Object.keys(formData).map(e => formData[e]); // Object.values(formData);
  const beverageSettings = {
    glass_volumes: values.map((v: any) => Number(v.volume)),
    glass_prices: values.map((v: any) => Number(v.price)),
    glass_enable: values.map((v: any) => Number(v.enabled))
  };
  saveValues(beverageSettings).then(res => {
    window.location.reload();
  });
};
const format = value => {
  const hasDot = value.indexOf(".") > -1;
  if (!hasDot) {
    return value.length > 1 && value[0] === "0" ? "0." + value.substring(1) : value;
  }
  const [first, ...rest] = value.split(".");
  return `${first}.${rest.join("").substring(0, 2)}`;
};
const FormElements = enhance(
  ({ bindInputGroup, formData, onBack, submenu, onSave, saving }) => {
    return (
      <React.Fragment>
        <div className={styles.submenu}>
          {submenu.map((el, i) => {
            return (
              <Card title={el.label_id} key={i}>
                <Field id={`enabled-${el.id}`} label={__("enabled")} theme={{}}>
                  <Checkbox
                    id={`enabled-${el.id}`}
                    name={el.id}
                    labels={[__("on"), __("off")]}
                    {...bindInputGroup({
                      group: el.id,
                      name: "enabled",
                      value: Boolean(el.enabled)
                    })}
                  />
                </Field>
                <div>
                <Field id={`price-${el.id}`} label={__("price")} theme={{}}>
                    <InputWithKeyboard
                      id={`price-${el.id}`}
                      title={__("price")}
                      layout={"numericAlt"}
                      theme={styles}
                      {...bindInputGroup({
                        name: `price`,
                        group: el.id,
                        value: el.price,
                        transform: format
                      })}
                    />
                  </Field>
                  <Field id={`volume-${el.id}`} label={__("volume")} theme={{}}>
                    <InputWithKeyboard
                      id={`volume-${el.id}`}
                      title={__("volume")}
                      layout={"numericAlt"}
                      theme={styles}
                      {...bindInputGroup({
                        group: el.id,
                        name: "volume",
                        value: el.volume,
                        transform: format
                      })}
                    />
                  </Field>
                </div>
              </Card>
            );
          })}
        </div>
        <div className={"menu-button-bar"}>
          <button className={"button-bar__button"} onClick={onBack}>
            {__("back")}
          </button>
          <button
            onClick={onSave(formData)}
            className={"button-bar__button"}
            disabled={saving}
          >
            {saving ? __("saving_button") : __("save")}
          </button>
        </div>
      </React.Fragment>
    );
  }
);
const SubMenu = withSubMenu(
  ({
    saveValues,
    runAction,
    onBack,
    getSubMenuState,
    // submenu,
    getSubMenuState: { data: submenu, loading, error }
  }) => {
    if (!submenu) {
      return null;
    }
    return (
      <React.Fragment>
        <FormElements
          onSave={onSave(saveValues)}
          submenu={submenu}
          onBack={onBack}
          initialData={getInitialFormData(submenu)}
        />
      </React.Fragment>
    );
  }
);
export default SubMenu;
