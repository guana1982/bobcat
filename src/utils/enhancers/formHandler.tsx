import { compose, withState, withHandlers, setDisplayName } from "recompose";
const stateFromElements = elements => {
  if (!elements || !elements.length) return {};
  return elements.reduce((a, b) => {
    if (b.type === "select" || b.type === "multi") {
      a[b.id] = b.default_value;
    } else {
      a[b.id] = b.value;
    }
    return a;
  }, {});
};
export default compose(
  setDisplayName("FormHandler"),
  // TODO: use a prop to set initial state
  withState("formData", "setFormData", ({ initialData, elements }) => initialData || stateFromElements(elements)),
  withState("formError", "setFormError", {}),
  withHandlers({
    resetForm: ({ setFormData }) => () => {
      // TODO: use a prop to reset to initial state
      setFormData({});
    },
    bindInputGroup: ({ setFormData, formData }) => ({
      name,
      group,
      value: initialValue,
      transform,
      validate
    }) => {
      return {
        initialValue,
        defaultValue: formData[group] !== undefined ? formData[group][name] : undefined,
        onChange: rawValue => {
          const value = transform ? transform(rawValue) : rawValue;
          setFormData(current => ({
            ...current,
            [group]: {
              ...current[group],
              [name]: value
            }
          }));
        }
      };
    },
    bindInput: ({ setFormData, setFormError, formData }) => ({
      type,
      name,
      value: initialValue,
      onChange,
      transform,
      validate
    }) => {
      return {
        onChange: rawValue => {
          const value = transform ? transform(rawValue) : rawValue;
          const validation = validate ? validate(value) : { isValid: true };
          if (validation.isValid === false) {
            setFormError(currentError => ({
              ...currentError,
              [name]: validation.reason
            }));
          } else {
            setFormError(currentError => ({
              ...currentError,
              [name]: null
            }));
          }
          setFormData(current => ({
            ...current,
            [name]: value
          }));
          onChange && onChange(value);
        },
        defaultValue: formData[name] !== undefined ? formData[name] : initialValue
      };
    }
  })
);
