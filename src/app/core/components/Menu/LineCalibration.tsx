import * as React from "react";
import { compose, withProps, setDisplayName } from "recompose";
import { __ } from "@utils/lib/i18n";
import withLineCalibration from "@utils/enhancers/lineCalibration";
import Pagination from "@components/common/Pagination";
import withPaginatedElements from "@components/common/paginatedElements";
import InputWithKeyboard from "@components/common/InputWithKeyboard";
import BeverageLogo from "@components/common/Logo";
import Field from "@components/common/Field";
import withFormHandler from "@utils/enhancers/formHandler";
import CarbonationImage from "../../Menu/CarbonationImage";
import * as styles from "../../Menu/Custom/LineCalibration.scss";

const POURING_SECONDS = 6;
const INPUT_UNIT = "ml";
const defaultPourSettings = line => ({
  beverage_size_id: 3,
  carbonation_level: Math.max(...line.carbonation_levels.values),
  topping_id: 0,
  topping_perc_id: 0,
  beverage_id: line.beverage_id,
  pour_method: "timed",
  line_id: line.line_id
});
const round = (num, decimal = 2) => {
  const rounder: any = 1 + [...Array(decimal).keys()].map(d => "0").join("");
  return Math.round(num * rounder) / rounder;
};
const format = value => {
  const hasDot = value.indexOf(".") > -1;
  if (!hasDot) {
    return value.length > 1 && value[0] === "0" ? "0." + value.substring(1) : value;
  }
  const [first, ...rest] = value.split(".");
  return `${first}.${rest.join("").substring(0, 2)}`;
};
const enhance = compose(
  setDisplayName("LineCalibration"),
  withProps(() => ({
    elementsPerPage: 1,
    elementsAccessor: ({ lines }) => lines
  })),
  withPaginatedElements(),
  withFormHandler
);
const PaginatedLineCalibration = enhance(
  ({
    lines,
    page,
    totalPages,
    nextPage,
    prevPage,
    bindInputGroup,
    formData,
    unit,
    onSelectUnit,
    resetForm,
    onBack,
    lineTest,
    lineTestState: { data: lineTestData, loading: lineTestLoading, error: lineTestError },
    testPour,
    testPourState: { data: pouringData, loading: pouringLoading, error: pouringError },
    updateCalibration,
    updateCalibrationState: { data: updateCalibrationResults, loading: savingCalibration, error: updateCalibrationError },
    onSave
  }) => {
    const line = lines[page - 1];
    const samples = formData[`line_${line.beverage_id}`] ? formData[`line_${line.beverage_id}`] : {};
    const samplesCount = Object.keys(samples)
      .filter(s => s.includes(unit))
      .filter(k => samples[k].length > 0).length;
    const avg =
      Object.keys(samples)
        .filter(s => s.includes(unit))
        .reduce((a, sample) => {
          console.log(a, sample);
          if (samples[sample]) {
            a += Number(samples[sample]);
          }
          return a;
        }, 0) / samplesCount;
    const currentFlow = unit === "gr" ? round(line.current_flow_rate * line.density * 6, 2) : round(line.current_flow_rate * 6, 2);
    const target = unit === "gr" ? round(line.target_flow_rate * line.density * 6, 2) : round(line.target_flow_rate * 6, 2);
    // let avgFlow = round((unit === 'gr' ? (INPUT_UNIT === 'gr' ? avg : avg * line.density) : (INPUT_UNIT === 'ml' ? avg : avg * line.density)), 2) || 0
    let avgFlow = round(avg, 2) || 0;
    const saveCalibration = async () => {
      let avgFlowRate = unit === "ml" ? avg / 6 : avg / line.density / 6;
      // switch (unit) {
      //   case 'gr':
      //     avgFlowRate = avg, 2)
      //     break
      //   default:
      //     avgFlowRate = avgFlow
      // }
      await updateCalibration([
        {
          line_id: line.line_id,
          average_flow_rate: Number(avgFlowRate)
        }
      ]);
      resetForm();
      onSave && onSave();
    };
    const onTestPour = () => {
      lineTest(defaultPourSettings(line));
    };
    const onPour = () => {
      testPour(defaultPourSettings(line));
    };
    const minFlow = target / 1.05;
    const maxFlow = target * 1.05;
    const calibrationOutOfRange = currentFlow > maxFlow || currentFlow < minFlow;
    console.log(currentFlow, minFlow, maxFlow);
    let stepDescription = "calibrate_descr_1";
    if (samplesCount > 0) {
      stepDescription = "calibrate_descr_2";
    }
    if (calibrationOutOfRange) {
      stepDescription = "calibration_value_not_in_range";
    }
    return (
      <React.Fragment>
        <Pagination page={page} totalPages={totalPages} onNext={nextPage} onPrev={prevPage} />
        <div className={styles.lines}>
          <div className={styles.line}>
            <div className={styles.lineNo}>
              {__("line")} #{line.line_id}
            </div>
            <div className={styles.logo}>
              <BeverageLogo beverage={line} />
            </div>
            <div>
              <div className={styles.infoItem}>
                <label className={styles.infoDt}>{__("name")}</label>
                <div className={styles.infoDd}>{__(line.beverage_label_id)}</div>
              </div>
              <div className={styles.infoItem}>
                <label className={styles.infoDt}>{__("density")}</label>
                <div className={styles.infoDd}>{line.density}</div>
              </div>
              {process.env.INTELLITOWER_VENDOR === "pepsi" && (
                <div className={styles.infoItem}>
                  <label className={styles.infoDt}>{__("dilution_ratio")}</label>
                  <div className={styles.infoDd}>{Number.parseFloat(line.ratio).toFixed(5)}</div>
                </div>
              )}
              {process.env.INTELLITOWER_VENDOR !== "waterbar" && (
                <div className={styles.infoItem}>
                  <label className={styles.infoDt}>{__("carbonation_levels")}</label>
                  <div className={styles.infoDd}>
                    {line.carbonation_levels &&
                      line.carbonation_levels.values.map((level, i) => {
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
                <div className={styles.infoDd}>{line.last_calibration_date}</div>
              </div>
            </div>
            <div>
              <h3>{__("mass_flow_rate")}</h3>
              <div className={styles.infoItem}>
                <label className={styles.infoDt}>{__("max")}</label>
                <span className={styles.infoDd}>
                  {round(maxFlow, 2)}
                  {__(unit)}
                </span>
              </div>
              <div className={styles.infoItem}>
                <label style={{ color: "green" }} className={styles.infoDt}>
                  {__("target")}
                </label>
                <span style={{ color: "green" }} className={styles.infoDd}>
                  {round(target, 2)}
                  {__(unit)}
                </span>
              </div>
              <div className={styles.infoItem}>
                <label className={styles.infoDt}>{__("min")}</label>
                <span className={styles.infoDd}>
                  {round(minFlow, 2)}
                  {__(unit)}
                </span>
              </div>
            </div>
          </div>
          <div className={styles.flowStats}>
            <div className={styles.units}>
              <button
                onClick={onSelectUnit("gr")}
                className={styles.button}
                style={{
                  background: unit === "gr" ? "#444" : "inherit",
                  color: unit === "gr" ? "#fff" : "inherit"
                }}
              >
                {__("grams")}
              </button>
              <button
                onClick={onSelectUnit("ml")}
                className={styles.button}
                style={{
                  background: unit === "ml" ? "#444" : "inherit",
                  color: unit === "ml" ? "#fff" : "inherit"
                }}
              >
                {__("milliliters")}
              </button>
            </div>
            <div className={styles.flowMeter}>
              <label className={styles.flowLabel}>{__("avg_flow")}</label>
              <data className={styles.flowValue}>
                {String(avgFlow).split(".")[0] || "0"}.
                <small>
                  {String(avgFlow).split(".")[1] || "0"} {__(unit === "gr" ? "gr/6s" : "ml/6s")}
                </small>
              </data>
            </div>
            <div className={styles.flowMeter}>
              <label className={styles.flowLabel}>{__("current_flow")}</label>
              <data
                className={styles.flowValue}
                style={{
                  color: calibrationOutOfRange ? "red" : "inherit"
                }}
              >
                {String(currentFlow || "0").split(".")[0]}.
                <small
                  style={{
                    color: calibrationOutOfRange ? "red" : "inherit"
                  }}
                >
                  {String(currentFlow).split(".")[1] || "0"} {__(unit === "gr" ? "gr/6s" : "ml/6s")}
                </small>
              </data>
            </div>
          </div>
          <div className={styles.calibration}>
            <p
              style={{
                color: calibrationOutOfRange ? "red" : "inherit"
              }}
            >
              {__(stepDescription)}
            </p>
            <div className={styles.calibrationSamples}>
              {unit === "gr" &&
                [...Array(5).keys()].map(i => {
                  return (
                    <Field key={"line_" + line.beverage_id + "_" + i} label={`${__("sample")} ${i + 1}`} id={"samplegr_" + i} theme={styles}>
                      <InputWithKeyboard
                        id={"samplegr_" + i}
                        layout="numericFloatAlt"
                        name={"samplegr_" + i}
                        theme={styles}
                        placeholder="0.00"
                        {...bindInputGroup({
                          name: "samplegr_" + i,
                          group: "line_" + line.beverage_id,
                          transform: format
                        })}
                      >
                        {value => <div className={styles.sampleValue}>{value.length ? value : "0.00"}</div>}
                      </InputWithKeyboard>
                    </Field>
                  );
                })}
              {unit === "ml" &&
                [...Array(5).keys()].map(i => {
                  return (
                    <Field key={"line_" + line.beverage_id + "_" + i} label={`${__("sample")} ${i + 1}`} id={"sampleml_" + i} theme={styles}>
                      <InputWithKeyboard
                        id={"sampleml_" + i}
                        layout="numericFloatAlt"
                        name={"sampleml_" + i}
                        theme={styles}
                        placeholder="0.00"
                        {...bindInputGroup({
                          name: "sampleml_" + i,
                          group: "line_" + line.beverage_id,
                          transform: format
                        })}
                      >
                        {value => <div className={styles.sampleValue}>{value.length ? value : "0.00"}</div>}
                      </InputWithKeyboard>
                    </Field>
                  );
                })}
              <div>
                <button onClick={resetForm}>{__("clear_all")}</button>
              </div>
            </div>
          </div>
          <div className={"menu-button-bar"}>
            <button className={"button-bar__button"} onClick={onBack}>
              {__("back")}
            </button>
            <button className={"button-bar__button button-bar__button--light"} onClick={onTestPour}>
              {lineTestLoading ? __("line_testing") : __("test_beverage")}
            </button>
            <button className={"button-bar__button button-bar__button--light"} onClick={onPour}>
              {pouringLoading ? __("beverage_testing") : __("test_line")}
            </button>
            <button className={"button-bar__button"} onClick={saveCalibration}>
              {savingCalibration ? __("saving_calibration") : __("save")}
            </button>
          </div>
        </div>
      </React.Fragment>
    );
  }
);
export default withLineCalibration(({ // getLinesConfigState: { data: config = [], error, loading },
  initialPage: lineIndex, lines, selectUnit, unit, ...rest }) => {
  // if (error) {
  //   return <div>Cannot retrieve line config</div>
  // }
  return (
    <div className={styles.lines}>
      <PaginatedLineCalibration lines={lines} initialPage={lineIndex} onSelectUnit={selectUnit} unit={unit} {...rest} />
    </div>
  );
});
