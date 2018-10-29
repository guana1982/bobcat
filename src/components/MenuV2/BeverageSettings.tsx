import * as React from "react";
import {
  compose,
  withProps,
  withState,
  withHandlers,
  setDisplayName,
  onlyUpdateForKeys,
  mapProps
} from "recompose";
import { uniq, flatten } from "lodash";
import { __ } from "../../lib/i18n";
import BeveragesDropdown from "../../VendorComponents/Menu/Custom/BeveragesDropdown";
import withPaginatedElements from "../../components/common/paginatedElements";
import BeverageLogo from "../../VendorComponents/Beverage/Logo";
import Pagination from "../../components/common/Pagination";
import withLines from "../../enhancers/lines";
import LineCalibration from "./LineCalibration";
import CarbonationImage from "../../VendorComponents/Menu/CarbonationImage";
import * as styles from "../../VendorComponents/Menu/Custom/Lines.scss";

const SODA = 2;
const WATER = 1;
const AMB = 3;
const NOT_USED = -1;
const noop = () => {};
const enhance = compose(
  setDisplayName("Lines"),
  onlyUpdateForKeys(["page", "totalPages", "saving"]),
  withState("linesConfig", "setLinesConfig", props => {
    // const linesConfig = [...Array(props.valvesCount - 2).keys()].map((lineIndex, index) => {
    //   const lineId = lineIndex + 1;
    //   const line = props.initialLines.find(l => l.line_id === lineId) || {};
    //   return {
    //     line_id: lineId,
    //     beverage_id: line.beverage_id || -1,
    //     beverage_menu_index: line.beverage_menu_index || -1,
    //     beverage_label_id: line.beverage_label_id || -1,
    //     image: line.image || null,
    //     name: line.shortname || null
    //   };
    // });
    const linesConfig = props.initialLines
      .filter(l => l.line_id > 0 && l.line_id !== SODA && l.line_id !== WATER && l.line_id !== AMB);
    return linesConfig;
  }),
  withHandlers({
    updateLines: ({ setLinesConfig, linesConfig }) => line => {
      const nextLines = linesConfig.slice();
      const index = linesConfig.indexOf(line);
      nextLines[index] = line;
      setLinesConfig(nextLines);
    }
  }),
  mapProps(props => {
    return {
      ...props,
      linesConfig: props.linesConfig // .sort((a, b) => a.line_id - b.line_id)
    };
  }),
  withProps({
    elementsAccessor: ({ linesConfig }) => {
      return linesConfig;
    }
  }),
  withPaginatedElements()
);
const PaginatedLines = enhance(
  ({
    availableBeverages,
    initialLines,
    linesConfig,
    updateLines,
    onCalibrate,
    page,
    totalPages,
    nextPage,
    prevPage,
    onBack,
    onSave,
    country = "zh_CN",
    saving,
    elementsPerPage,
    valvesCount
  }) => {
    const start = (page - 1) * elementsPerPage;
    const end = start + elementsPerPage;
    let countries;
    // if (process.env.INTELLITOWER_VENDOR === 'pepsi') {
    // } else {
    //   countries = [...new Set(
    //     ...initialLines.map(b => b.country.map(c => c))
    //   )]
    //
    //   console.log(...new Set(
    //     ...initialLines.map(b => b.country.map(c => c))
    //   ));
    // }
    countries = uniq(flatten(availableBeverages.filter(b => b.country).map(b => b.country.map(c => c))));
    const onSelectBeverage = (line, index) => beverage => {
      if (beverage.beverage_id === NOT_USED) {
        line.beverage_menu_index = -1;
      } else {
        line.beverage_menu_index = index;
      }
      line.beverage_id = beverage.beverage_id;
      line.beverage_label_id = beverage.beverage_label_id;
      updateLines(line, index);
    };
    const sodaLine = initialLines.find(l => l.line_id === SODA);
    const sodaLineIndex = initialLines.indexOf(sodaLine) + 1;
    const waterLine = initialLines.find(l => l.line_id === WATER);
    const waterLineIndex = initialLines.indexOf(waterLine) + 1;
    const ambLine = initialLines.find(l => l.line_id === AMB);
    const ambLineIndex = initialLines.indexOf(ambLine) + 1;
    return (
      <React.Fragment>
        <Pagination page={page} totalPages={totalPages} onNext={nextPage} onPrev={prevPage} />
        <div className={styles.lines}>
          {linesConfig.slice(start, end).map((line, index) => {
            const actualIndex = line.line_id; // index + elementsPerPage * (page - 1) + 1;
            const lineBeverage = availableBeverages.find(l => l.beverage_id === line.beverage_id) || {};
            return (
              <div key={actualIndex} className={styles.line}>
                <div className={styles.lineNo}>
                  <BeveragesDropdown
                    onSelect={onSelectBeverage(line, actualIndex)}
                    linesConfig={linesConfig}
                    beverages={availableBeverages}
                    countries={countries}
                    initialCountry={country}
                    title={__("line") + "#" + line.line_id}
                  />
                </div>
                <div className={styles.logo}>
                  <BeverageLogo beverage={lineBeverage} />
                </div>
                {line.beverage_id !== NOT_USED && (
                  <React.Fragment>
                    <div>
                      <div className={styles.infoItem}>
                        <label className={styles.infoDt}>{__("name")}</label>
                        <div className={styles.infoDd}>{__(lineBeverage.beverage_label_id)}</div>
                      </div>
                      <div className={styles.infoItem}>
                        <label className={styles.infoDt}>{__("density")}</label>
                        <div className={styles.infoDd}>{lineBeverage.density}</div>
                      </div>
                      {process.env.INTELLITOWER_VENDOR === "pepsi" && (
                        <div className={styles.infoItem}>
                          <label className={styles.infoDt}>{__("dilution_ratio")}</label>
                          <div className={styles.infoDd}>{Number.parseFloat(lineBeverage.ratio).toFixed(5)}</div>
                        </div>
                      )}
                      {process.env.INTELLITOWER_VENDOR !== "waterbar" && (
                        <div className={styles.infoItem}>
                          <label className={styles.infoDt}>{__("carbonation_levels")}</label>
                          <div className={styles.infoDd}>
                            {lineBeverage.carbonation_levels &&
                              lineBeverage.carbonation_levels.values.map((level, i) => {
                                return (
                                  <span key={i}>
                                    <CarbonationImage level={level} />
                                  </span>
                                );
                              })}
                          </div>
                        </div>
                      )}
                      <div className={styles.infoItem}>
                        <label className={styles.infoDt}>{__("last_calibration_date")}</label>
                        <div className={styles.infoDd}>{lineBeverage.last_calibration_date}</div>
                      </div>
                    </div>
                    <div>
                      <button
                        disabled={lineBeverage.beverage_id === "NOT_USED"}
                        className={styles.button}
                        onClick={onCalibrate(lineBeverage)}
                      >
                        {__("calibrate")}
                      </button>
                    </div>
                  </React.Fragment>
                )}
              </div>
            );
          })}
        </div>
        <div className={"menu-button-bar"}>
          <button onClick={onBack} className={"button-bar__button"}>
            {__("back")}
          </button>
          <button className={"button-bar__button"} onClick={onCalibrate(waterLine)}>
            {__("cal_water")}
          </button>
          <button className={"button-bar__button"} onClick={onCalibrate(sodaLine)}>
            {__("cal_soda")}
          </button>
          <button className={"button-bar__button"} onClick={onCalibrate(ambLine)}>
            {__("cal_amb")}
          </button>
          <button className={"button-bar__button"} onClick={!saving ? onSave(linesConfig) : noop}>
            {__(!saving ? "save_lines" : "saving")}
          </button>
        </div>
      </React.Fragment>
    );
  }
);
const enhanceLines = compose(
  withLines,
  setDisplayName("BeverageSettings"),
  withState("step", "setCurrentStep", { step: 1, lineIndex: 1 }),
  withHandlers({
    goToStep: ({ setCurrentStep }) => step => {
      setCurrentStep(step);
    }
  })
);
const Lines = enhanceLines(
  ({
    getLines,
    getLinesState: { data: lines = [], error, loading },
    saveLines,
    saveLinesState: { data: saveResults, error: saveError, loading: saving },
    step,
    goToStep,
    onBack,
    elementsPerPage,
    valvesCount,
    ...rest
  }) => {
    if (error) {
      return <div>Cannot retrieve lines</div>;
    }
    const save = updatedLines => () => {
      saveLines(updatedLines).then(res => {
        window.location.reload();
      });
    };
    const onCalibrateStep = (line) => e => {
      const i = lines.indexOf(line);
      goToStep({ step: 2, lineIndex: i + 1 });
    };
    const onLinesStep = () => {
      goToStep({ step: 1 });
    };
    const sortedLines = lines.filter(l => l.line_id > -1); // .sort((a, b) => a.line_id - b.line_id);
    const availableBeverages = lines.filter(l => l.line_id !== WATER && l.line_id !== SODA && l.line_id !== AMB).slice();
    availableBeverages.unshift({
      beverage_id: -1,
      beverage_logo_id: "0",
      beverage_menu_index: -1
    });
    return (
      <React.Fragment>
        {step.step === 1 &&
          lines.length > 0 && (
            <div className={styles.lines}>
              <PaginatedLines
                initialLines={sortedLines}
                availableBeverages={availableBeverages}
                onCalibrate={onCalibrateStep}
                onBack={onBack}
                onSave={save}
                saving={saving}
                elementsPerPage={elementsPerPage}
                valvesCount={valvesCount}
                {...rest}
              />
            </div>
          )}
        {step.step === 2 &&
          lines.length > 0 && (
            <LineCalibration
              lines={sortedLines}
              initialPage={step.lineIndex}
              onBack={onLinesStep}
              onSave={getLines}
              {...rest}
            />
          )}
      </React.Fragment>
    );
  }
);
export default Lines;
