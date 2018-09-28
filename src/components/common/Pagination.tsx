import * as React from "react";
import { __ } from "../../utils/lib/i18n";
import * as styles from "../../scss/ui/Pagination.scss";
const Pagination = ({ orientation = 1, page, totalPages, onNext, onPrev }) => {
  return (
    <div className={styles.pagination}>
      <div className={styles.pages}>
        <label>{__("page")}</label>
        <label>
          {page} / {totalPages}
        </label>
      </div>
      <button className={styles.buttonPrev} onClick={onNext}>
        {orientation === 1 ? "↓" : "↓"}
      </button>
      <button className={styles.buttonNext} onClick={onPrev}>
        {orientation === 1 ? "↑" : "←"}
      </button>
    </div>
  );
};
export default Pagination;
