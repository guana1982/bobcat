import * as React from "react";
import { withProps, compose } from "recompose";
import { __ } from "../../lib/i18n";
import { withSubMenu } from "../../enhancers/menu";
import withFormHandler from "../../enhancers/formHandler";
import withPaginatedElements from "../../components/common/paginatedElements";
import InputWithKeyboard from "../../components/common/InputWithKeyboard";
import Card from "../../components/common/Card";
import Field from "../../components/common/Field";
import Select from "../../components/common/Select";
import SelectDrop from "../../components/common/SelectDrop";
import Checkbox from "../../components/common/Checkbox";
import VectorInput from "../../components/common/Vector";
// import InputList from 'components/common/InputList'
import Pagination from "../../components/common/Pagination";
import ErrorDialog from "../../components/common/ErrorDialog";
import * as styles from "../../VendorComponents/Menu/DefaultSubmenu.scss";

const enhance = compose(
  withProps({
    elementsAccessor: ({ elements = [], actions = [] }) => elements.concat(actions)
  }),
  withPaginatedElements(),
  withFormHandler
);
const KEYBOARD_LAYOUTS = {
  text: "latin",
  number: "numericAlt"
};
const ElementType = (
  id,
  label,
  type,
  value,
  bindInput,
  defaultValue,
  readOnly,
  unit,
  options?
 ) => {
  switch (type) {
    case "vector-text":
    case "vector-number":
      return (
        <VectorInput
          id={id}
          title={label}
          type={type.replace("vector-", "")}
          disabled={readOnly}
          {...bindInput({ name: id, value })}
        />
      );
    case "number":
    case "text":
      return (
        <InputWithKeyboard
          id={id}
          title={label}
          layout={KEYBOARD_LAYOUTS[type]}
          disabled={readOnly}
          suffix={unit}
          theme={styles}
          {...bindInput({
            value,
            name: id,
            transform: d => {
              if (id === "tech_password" || id === "crew_password" || id === "master_password") {
                return d.substring(0, 5);
              }
              // if (type === 'number' && String(d).length > 0 && d !== '') {
              //   return Number(d)
              // }
              return d;
            },
            validate: d => {
              if (id === "tech_password" || id === "crew_password" || id === "master_password") {
                if (String(d).length < 5) {
                  return {
                    isValid: false,
                    reason: "pin_min_length_error"
                  };
                }
              }
              return {
                isValid: true
              };
            }
          })}
        />
      );
    case "boolean":
      return <Checkbox id={id} name={id} {...bindInput({ name: id, value })} />;
    case "select":
      // if (id === 'country') {
      //   return (
      //     <InputList
      //       id={id}
      //       options={value}
      //       {...bindInput({ name: id, value })} />
      //   )
      // }
      return <SelectDrop options={value} {...bindInput({ name: id, value })} />;
    case "toggle":
      return (
        <Select
          multi={false}
          options={defaultValue}
          initialValue={value}
          id={id}
          title={label}
          {...bindInput({ name: id, value })}
        >
          {value.map((d, i) => {
            return (
              <option value={d} key={i}>
                {d}
              </option>
            );
          })}
        </Select>
      );
    case "multi":
      return (
        <Select
          multi
          options={value}
          initialValue={defaultValue}
          id={id}
          title={label}
          {...bindInput({ name: id, value })}
        >
          {value.map((d, i) => {
            return (
              <option value={d} key={i}>
                {d}
              </option>
            );
          })}
        </Select>
      );
    default:
      return <div />;
  }
};

const save = (formData, onSave) => () => {
  onSave(formData).then(res => {
    window.location.reload();
  });
};

const run = (action, onRunAction, onSwitchOffDisplay) => () => {
  onRunAction(action.id);
  if (action.id === "switch_off_display") {
    onSwitchOffDisplay && onSwitchOffDisplay();
  }
};

const FormElements = enhance(
  ({
    actions = [],
    elements = [],
    page,
    nextPage,
    prevPage,
    totalPages,
    bindInput,
    formData,
    formError,
    saving,
    onBack,
    onRunAction,
    onSave,
    submenu,
    elementsPerPage,
    actionError,
    saveError,
    onSwitchOffDisplay = () => {}
  }) => {
    const start = (page - 1) * elementsPerPage;
    const end = start + elementsPerPage;
    const grouped = elements
      .concat(actions.map(a => ({ ...a, type: "action" })))
      .slice(start, end)
      .reduce((a, el) => {
        if (!a[el.group_label_id]) {
          a[el.group_label_id] = [];
        }
        a[el.group_label_id].push(el);
        return a;
      }, {});
    return (
      <React.Fragment>
        <Pagination page={page} totalPages={totalPages} onNext={nextPage} onPrev={prevPage} />
        <div className={styles.submenu}>
          {actionError && <ErrorDialog message={actionError} />}
          {saveError && <ErrorDialog message={saveError} />}
          {Object.keys(grouped).map(group => {
            const groupActions = grouped[group].filter(el => el.type === "action");
            const groupElements = grouped[group].filter(el => el.type !== "action");
            return (
              <Card title={__(group)} key={group}>
                <React.Fragment>
                  {groupElements.map(el => {
                    const label = __(el.label_id);
                    return (
                      <Field key={el.id} id={el.id} label={label} theme={null}>
                        <ElementType
                          id={el.id}
                          label={__(el.label_id)}
                          type={el.type}
                          bindInput={bindInput}
                          defaultValue={el.default_value}
                          value={el.value}
                          readOnly={el.permission === "read"}
                          unit={el.unit}
                        />
                        {formError[el.id] && (
                          <div className={styles.fieldError}>{__(formError[el.id])}</div>
                        )}
                      </Field>
                    );
                  })}
                </React.Fragment>
                <div className={styles.groupActions}>
                  {groupActions.map((action, index) => {
                    return (
                      <button
                        key={action.id}
                        className={styles.groupButton}
                        onClick={run(action, onRunAction, onSwitchOffDisplay)}
                      >
                        {__(action.label_id)}
                      </button>
                    );
                  })}
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
            onClick={save(formData, onSave)}
            className={"button-bar__button"}
            disabled={saving}
          >
            {saving ? __("saving_button") : __(submenu.save.label_id)}
          </button>
        </div>
      </React.Fragment>
    );
  }
);
const SubMenu = withSubMenu(
  ({
    onBack,
    runAction,
    saveValues,
    submenu,
    saveState: { data: saveResults, loading: saving, error: saveError },
    __runActionState: { data: actionResults, loading: actionLoading, error: actionError },
    elementsPerPage,
    onSwitchOffDisplay
  }) => {
    if (!submenu || !submenu.id) {
      return null;
    }
    return (
      <FormElements
        elements={submenu.elements}
        actions={submenu.actions}
        saving={saving}
        submenu={submenu}
        onRunAction={runAction}
        onSave={saveValues}
        onBack={onBack}
        elementsPerPage={elementsPerPage}
        saveError={saveError}
        actionError={actionError}
        onSwitchOffDisplay={onSwitchOffDisplay}
      />
    );
  }
);
export default SubMenu;
