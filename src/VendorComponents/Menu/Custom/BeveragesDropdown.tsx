import * as React from "react";
import {
  withState,
  withHandlers,
  // withProps,
  compose
} from "recompose";
import withClickOutside from "../../../components/common/clickOutside";
import withDropdown from "../../../components/common/dropdown";
import withPaginatedElements from "../../../components/common/paginatedElements";
import { __ } from "../../../lib/i18n";
import BeverageLogo from "../../../VendorComponents/Beverage/Logo";
import * as styles from "./BeveragesDropdown.scss";

const CountriesDropdown = withDropdown(({ toggle, show, title, selected, onSelect, countries, handleClickOutside, onSelectCountry }) => {
  const selectCountry = country => () => {
    onSelect(country);
    onSelectCountry(country);
  };
  return (
    <div {...handleClickOutside()} className={styles.countriesDropdown}>
      <button onClick={toggle}>
        {__(title)}: <strong>{selected}</strong>
      </button>
      <React.Fragment>
        {show && (
          <div className={styles.countriesList}>
            {countries.map((country, i) => {
              return (
                <div
                  key={i}
                  onClick={selectCountry(country)}
                  className={styles.countryDropdownItem}
                  style={{
                    fontWeight: selected === country ? "bold" : "inherit"
                  }}
                >
                  {country}
                </div>
              );
            })}
          </div>
        )}
      </React.Fragment>
    </div>
  );
});
const OFFSET = 5;
const dropdown = compose(
  withState("show", "setVisibility", props => props.initialShow),
  withState("selected", "setSelected", props => props.initialSelected),
  withState("country", "setCountry", props => props.initialCountry),
  withHandlers({
    toggle: ({ setVisibility }) => () => {
      setVisibility(current => !current);
    },
    onClickOutside: ({ setVisibility }) => () => {
      setVisibility(false);
    },
    elementsAccessor: ({ beverages, country }) => () => {
      return beverages.filter(b => !b.country || (b.country.includes(country) || b.country.includes("all")));
    }
  }),
  withPaginatedElements(OFFSET),
  withClickOutside
);
const enhance = compose(
  // withBeverages,
  dropdown
);
const Dropdown = enhance(
  ({
    show,
    page,
    totalPages,
    beverages,
    title,
    toggle,
    nextPage,
    prevPage,
    jumpTo,
    handleClickOutside,
    onSelect,
    countries,
    initialCountry,
    country,
    setCountry,
    linesConfig
  }) => {
    const start = (page - 1) * OFFSET;
    const end = start + OFFSET;
    const beveragesList = beverages.filter(b => !b.country || b.country.includes(country) || b.country.includes("all")).slice(start, end);
    const selectBeverage = beverage => () => {
      onSelect(beverage);
      toggle();
    };
    const selectCountry = country => {
      jumpTo(1);
      setCountry(country);
    };
    return (
      <div {...handleClickOutside()} className={styles.container}>
        <button onClick={toggle} className={styles.title}>
          {title} <span className={styles.caret}>{show ? "▲" : "▼"}</span>
        </button>
        {show && (
          <div className={styles.dropdown}>
            <div className={styles.pagination}>
              <label style={{ marginRight: "1em" }}>
                {page}/{totalPages}
              </label>
              <button onClick={nextPage}>
                ↓
              </button>
              <button onClick={prevPage}>
                ↑
              </button>
            </div>
            <div>
              <CountriesDropdown title={"Country"} countries={countries} initialValue={initialCountry} onSelectCountry={selectCountry} />
            </div>
            <div className={styles.beveragesList}>
              {beveragesList.map((beverage, i) => {
                const isAvailable = beverage.beverage_id === -1 ? true : linesConfig.findIndex(l => l.beverage_id === beverage.beverage_id) < 0;
                return (
                  <div
                    className={styles.beverageItem}
                    onClick={selectBeverage(beverage)}
                    style={{
                      opacity: !isAvailable ? 0.5 : 1
                    }}
                    key={i}
                  >
                    <BeverageLogo beverage={beverage} />
                    <div className={styles.beverageName}>{__(beverage.beverage_label_id || "not_used")}</div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    );
  }
);
export default Dropdown;
