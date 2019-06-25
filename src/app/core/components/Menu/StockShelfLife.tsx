import * as React from "react";
import { compose, withProps, withState, withHandlers, setDisplayName } from "recompose";
import classNames from "classnames";
import { __ } from "@utils/lib/i18n";
import BibSizeDropdown from "../../Menu/Custom/BibSizeDropdown";
import Pagination from "../common/Pagination";
import withPaginatedElements from "../common/paginatedElements";
import withLines from "@utils/enhancers/lines";
import BeverageLogo from "@components/common/Logo";
import * as styles from "../../Menu/Custom/Lines.scss";
import DateInput from "../common/InputDate";

const BIB_SIZES = [5, 10, 15, 20];
const BIB_SIZES_LABELS = [__("5L"), __("10L"), __("15L"), __("20L")];
const SODA = "soda";
const WATER = "still";
const AMB = "amb";

const enhance = compose(
  setDisplayName("Lines"),
  withState("lines", "setLines", props => {
    const linesConfig = props.initialLines
      .filter(l => l.line_id > 0 && l.beverage_type !== SODA && l.beverage_type !== WATER && l.beverage_type !== AMB)
      // .sort((a, b) => a.line_id > b.line_id)
      .slice();
    return linesConfig;
  }),
  withProps({
    updateLine: ({ setLines, lines }) => (line, index) => {
      const nextLines = lines.slice();
      nextLines.splice(index, 1, line);
      setLines(nextLines);
    },
    elementsAccessor: ({ lines }) => {
      return lines;
    }
  }),
  withHandlers({
    updateLine: ({ setLines, lines }) => (line, index) => {
      const nextLines = lines.slice();
      nextLines.splice(index, 1, line);
      setLines(nextLines);
    },
    updateLines: ({ setLines }) => lines => {
      setLines(lines);
    },
    onSelectSize: ({ updateLine }) => (line, index) => size => {
      line.bib_size = size;
      updateLine(line, index);
    },
    onChangeExpiryDate: ({ updateLine }) => (line, index) => date => {
      line.bib_expiring_date = date;
      updateLine(line, index);
    },
    onChangeReloadDate: ({ updateLine }) => (line, index) => date => {
      line.bib_reload_date = date;
      updateLine(line, index);
    },
    onSave: ({ updateLines, lines, getLines, updateStockShelfLife }) => async () => {
      const update = await updateStockShelfLife(
        lines.map(line => ({
          line_id: line.line_id,
          bib_size: line.bib_size,
          reload_date: line.bib_reload_date,
          expiring_date: line.bib_expiring_date
        }))
      );
      if (!update || update.error) {
        console.log("error!", update);
      }
      const updatedLines = await getLines();
      updateLines(updatedLines);
    },
    onReset: ({ updateLine, resetStockShelfLife }) => (line, index) => async () => {
      await resetStockShelfLife({ line_id: line.line_id });
      updateLine(line, index);
    }
  }),
  withPaginatedElements()
);
const PaginatedLines = enhance(
  ({
    initialLines,
    lines,
    updateLine,
    page,
    totalPages,
    nextPage,
    prevPage,
    resetLine,
    updateStockShelfLife,
    saveValues,
    getLines,
    updateLines,
    onBack,
    onSave,
    onReset,
    onChangeExpiryDate,
    onChangeReloadDate,
    onSelectSize,
    elementsPerPage
  }) => {
    const start = (page - 1) * elementsPerPage;
    const end = start + elementsPerPage;
    const today = new Date();
    return (
      <React.Fragment>
        <Pagination page={page} totalPages={totalPages} onNext={nextPage} onPrev={prevPage} />
        <div className={styles.lines}>
          {lines.slice(start, end).map((line, index) => {
            const actualIndex = line.line_id; // index + elementsPerPage * (page - 1);
            const isExpired = new Date(line.bib_expiring_date) < today;
            const remainingPct = line.remaining_bib / line.bib_size;
            const lineStyles = classNames({
              [styles.line]: true,
            }); // [styles.lineExpired]: isExpired
            return (
              <div key={actualIndex} className={lineStyles}>
                <div className={styles.lineNo}>
                  <BibSizeDropdown
                    onSelectSize={onSelectSize(line, actualIndex)}
                    sizes={BIB_SIZES}
                    labels={BIB_SIZES_LABELS}
                    defaultValue={line.bib_size}
                    title={__("line") + "#" + actualIndex}
                  />
                </div>
                <div
                  className={styles.logo}
                  style={{
                    position: "relative"
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: 5,
                      background: "#333"
                    }}
                  >
                    <div
                      style={{
                        position: "absolute",
                        left: 0,
                        top: 0,
                        height: 5,
                        background: `hsl(${90 * remainingPct}, 100%, 50%)`,
                        width: `${remainingPct * 100}%`
                      }}
                    />
                  </div>
                  <BeverageLogo beverage={line} />
                </div>
                <div>
                  <div className={[styles.infoItem].join(" ")}>
                    <label className={styles.infoDt} htmlFor={`expiry-${line.line_id}`}>
                      {__("bib_expiry_date")}
                    </label>
                    <div className={styles.infoDd}>
                      <DateInput
                        id={`expiry-${line.line_id}`}
                        defaultValue={line.bib_expiring_date}
                        // value={line.bib_expiry_date ? new Date(line.bib_expiry_date) : ''}
                        onChange={onChangeExpiryDate(line, actualIndex)}
                      />
                    </div>
                  </div>
                  {line.second_shelf_life > 0 && (
                    <div className={styles.infoItem}>
                      <label className={styles.infoDt} htmlFor={`reload-${line.line_id}`}>
                        {__("bib_reload_date")}
                      </label>
                      <div className={styles.infoDd}>
                        <DateInput
                          id={`reload-${line.line_id}`}
                          defaultValue={line.bib_reload_date}
                          onChange={onChangeReloadDate(line, actualIndex)}
                        />
                      </div>
                    </div>
                  )}
                </div>
                <div>
                  <button
                    disabled={line.beverage_id === "NOT_USED"}
                    className={styles.button}
                    onClick={onReset(line, actualIndex)}
                  >
                    {__("bib_reset")}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
        <div className={"menu-button-bar"}>
          <button onClick={onBack} className={"button-bar__button"}>
            {__("back")}
          </button>
          <button className={"button-bar__button"} onClick={onSave}>
            {__("save_lines")}
          </button>
        </div>
      </React.Fragment>
    );
  }
);
const Lines = withLines(
  ({
    getLines,
    getLinesState: { data: lines = [], error, loading },
    resetLine,
    updateStockShelfLife,
    resetStockShelfLife,
    saveValues,
    onBack,
    elementsPerPage
  }) => {
    if (error) {
      return <div>Cannot retrieve lines</div>;
    }
    return (
      <div className={styles.lines}>
        {lines.length > 0 && (
          <PaginatedLines
            initialLines={lines}
            onBack={onBack}
            resetLine={resetLine}
            updateStockShelfLife={updateStockShelfLife}
            resetStockShelfLife={resetStockShelfLife}
            saveValues={saveValues}
            getLines={getLines}
            elementsPerPage={elementsPerPage}
          />
        )}
      </div>
    );
  }
);
export default Lines;
