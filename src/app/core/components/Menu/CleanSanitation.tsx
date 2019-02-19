import * as React from "react";
import { __ } from "@utils/lib/i18n";
import { compose, withProps, withState, withHandlers } from "recompose";
import withPaginatedElements from "@components/common/paginatedElements";
import withLines from "@utils/enhancers/lines";
// import InputWithKeyboard from '../../scss/ui/InputWithKeyboard'
import BeverageLogo from "@components/common/Logo";
import * as styles from "../../Menu/Custom/CleanSanitation.scss";
import CleanSanitationSteps from "./CleanSanitationSteps";
import Pagination from "@components/common/Pagination";

const enhance = compose(
  withProps(ownProps => ({
    ...ownProps,
    elementsAccessor: ({ lines }) => lines.filter(l => l.line_id > 0)
  })),
  withPaginatedElements()
);
const withSteps = compose(
  withState("step", "setStep", 1),
  withHandlers({
    goToStep: ({ setStep }) => step => {
      setStep(step);
    }
  }),
  withLines
);
const Lines = enhance(
  ({
    lines,
    onCleanStart,
    onCleanStop,
    page,
    totalPages,
    nextPage,
    prevPage,
    selectedLines,
    toggleLine,
    navigation,
    onContinue,
    onBack,
    elementsPerPage
  }) => {
    const start = (page - 1) * elementsPerPage;
    const end = start + elementsPerPage;
    return (
      <React.Fragment>
        {totalPages > 1 && (
          <Pagination page={page} totalPages={totalPages} onNext={nextPage} onPrev={prevPage} />
        )}
        <div
          className={styles.help}
          style={{ background: "#fff", padding: "1em", boxSizing: "border-box" }}
        >
          <h3>{__(`sanitate_step_${0}_title`)}</h3>
          <p>{__(`sanitate_step_${0}_descr`)}</p>
        </div>
        <div className={styles.lines}>
          {lines
            .sort((a, b) => a.line_id - b.line_id)
            .filter(l => l.line_id > 0)
            .slice(start, end)
            .map((line, index) => {
              console.log(elementsPerPage);
              const actualIndex = index + elementsPerPage * (page - 1);
              return (
                <div key={actualIndex} className={styles.line} onClick={toggleLine(line.beverage_id)}>
                  <div
                    style={{
                      background: selectedLines.indexOf(line.beverage_id) > -1 ? "#444" : "#eee",
                      color: selectedLines.indexOf(line.beverage_id) > -1 ? "#fff" : "inherit"
                    }}
                    className={styles.lineNo}
                  >
                    {__("line")} #{line.line_id}
                    <BeverageLogo beverage={line} />
                    <div>
                      <dl className={styles.infoList}>
                        <dt>{__("last_sanitation")}</dt>
                        <dd>{line.last_sanification_date}</dd>
                      </dl>
                    </div>
                  </div>
                </div>
              );
            })}
          <div className={"menu-button-bar"}>
            <button onClick={onBack} className={"button-bar__button"}>
              {__("back")}
            </button>
            <button onClick={onContinue} disabled={!selectedLines.length} className={"button-bar__button"}>
              {__("continue")}
            </button>
          </div>
        </div>
      </React.Fragment>
    );
  }
);

export default withSteps(
  ({
    getLines,
    getLinesState: { data: lines = [], error, loading },
    onBack,
    selectedLines,
    step,
    goToStep,
    resetLines,
    elementsPerPage,
    toggleExit,
    ...rest
  }) => {
    if (error) {
      return <div>Cannot retrieve lines</div>;
    }
    const onContinue = () => {
      goToStep(2);
    };
    const onFinish = async () => {
      await getLines();
      resetLines();
      goToStep(1);
    };
    return (
      <div style={{ height: "100%" }}>
        {step === 1 && (
          <Lines
            lines={lines}
            selectedLines={selectedLines}
            onBack={onBack}
            onContinue={onContinue}
            elementsPerPage={elementsPerPage}
            {...rest}
          />
        )}
        {step === 2 && (
          <CleanSanitationSteps
            onFinish={onFinish}
            lines={lines.filter(d => selectedLines.indexOf(d.beverage_id) > -1)}
            toggleExit={toggleExit}
          />
        )}
      </div>
    );
  }
);