import * as React from "react";
import Pagination from "../common/Pagination";
import { ConfigConsumer } from "@containers/index";
import mediumLevel from "@utils/MediumLevel";
import { __ } from "@utils/lib/i18n";
import { map } from "rxjs/operators";
import * as styles from "../../Menu/Custom/Alarms.scss";
import { IAlarm } from "@models/index";

interface AlarmsProps {
  onBack: () => void;
  elementsPerPage: number;
  menuId: string;
  submenuId: string;
  alarms?: IAlarm[];
}

interface AlarmsState {
  page: number;
  pageAlarm: number;
  totalPages: number;
  totalAlarms: number;
}

const prevStep = (step: number, totapStep: number) => step - 1 < 1 ? totapStep : step - 1;
const nextStep = (step: number, totapStep: number) =>  step + 1 > totapStep ? 1 : step + 1;

const formatDate = (d) => new Date(d).toLocaleString();

export class Alarms extends React.Component<AlarmsProps, AlarmsState> {

  readonly state: AlarmsState;

  constructor(props) {
    super(props);

    this.state = {
      page: null,
      pageAlarm: null, // index alarm + 1
      totalPages: null,
      totalAlarms: null
    };
  }

  componentDidMount() { }

  static getDerivedStateFromProps(props, state) {
    const { elementsPerPage, alarms } = props;
    const totalAlarms = alarms.length;
    if (!state.totalAlarms || state.totalAlarms !== totalAlarms) {
      const totalPages = Math.ceil(totalAlarms / elementsPerPage);
      return {
        page: totalAlarms > 0 ? 1 : 0,
        pageAlarm: null,
        totalAlarms: totalAlarms,
        totalPages: totalPages
      };
    }

    return null;
  }

  componentWillUnmount() { }

  /* ==== PAGES ==== */
  /* ======================================== */

  nextPage() {
    this.setState(prevState => ({
      ...prevState,
      page: nextStep(prevState.page, prevState.totalPages)
    }));
  }

  prevPage() {
    this.setState(prevState => ({
      ...prevState,
      page: prevStep(prevState.page, prevState.totalPages)
    }));
  }

  /* ==== ALARMS ==== */
  /* ======================================== */

  // defineState(alarms: IAlarm[]) {
  //   const { elementsPerPage } = this.props;
  //   const totalAlarms = alarms.length;
  //   const totalPages = Math.ceil(totalAlarms / elementsPerPage);
  //   return {
  //     page: 1,
  //     pageAlarm: null,
  //     totalAlarms: totalAlarms,
  //     totalPages: totalPages
  //   };
  // }

  switchStatus() {
    alert("switch");
  }

  /* ==== ALARM SELECTED ==== */
  /* ======================================== */

  private selectAlarm(index: number) {
    this.setState(prevState => ({
      ...prevState,
      pageAlarm: index
    }));
  }

  private nextAlarm() {
    const { pageAlarm, totalAlarms } = this.state;
    const index = nextStep(pageAlarm, totalAlarms);
    this.selectAlarm(index);
  }

  private prevAlarm() {
    const { pageAlarm, totalAlarms } = this.state;
    const index = prevStep(pageAlarm, totalAlarms);
    this.selectAlarm(index);
  }

  private clearAlarm() {
    this.setState(prevState => ({
      ...prevState,
      pageAlarm: null
    }));
  }

  private alarmIsSelected() {
    return this.state.pageAlarm != null;
  }

  /* ==== LAYOUT ==== */
  /* ======================================== */

  private AlarmsTable = () => {
    const { elementsPerPage } = this.props;
    let { page, totalPages } = this.state;
    const { alarms } = this.props;

    const start = (page - 1) * elementsPerPage;
    const end = start + elementsPerPage;
    const _alarms = alarms.slice(start, end);
    return (
      <React.Fragment>
        <Pagination page={page} totalPages={totalPages} onNext={() => this.nextPage()} onPrev={() => this.prevPage()} />
        <table className={styles.alarmsTable}>
          <tbody>
            <tr>
              <th></th>
              <th>{__("alarm_code")}</th>
              <th>{__("alarm_description")}</th>
              <th>{__("alarm_date")}</th>
              <th>{__("alarm_type")}</th>
              <th></th>
            </tr>
            {_alarms.length > 0 && _alarms.map((alarm, i) => {
              return (
                <tr key={i}>
                  <th><img src={`icons/${alarm.alarm_type}.svg`} /></th>
                  <th className={styles.center}>{alarm.alarm_code}</th>
                  <th>{__(alarm.alarm_description)}</th>
                  <th className={styles.center}>{formatDate(alarm.alarm_date)}</th>
                  <th className={styles.center}>{__(alarm.alarm_type)}</th>
                  <th>
                    <button onClick={() => this.selectAlarm(i + 1)} className={styles.detailsBtn}>
                      {__("details")}
                    </button>
                  </th>
                </tr>
              );
            })}
          </tbody>
        </table>
        <div className={"menu-button-bar"}>
          <button onClick={this.props.onBack} className={"button-bar__button"}>
            {__("back")}
          </button>
          <button disabled className={"button-bar__button"} />
        </div>
      </React.Fragment>
    );
  }

  private AlarmDetail = () => {
    let { pageAlarm, totalAlarms } = this.state;
    const { alarms } = this.props;
    const alarm = alarms[pageAlarm - 1];
    return(
      <React.Fragment>
        <Pagination page={pageAlarm} totalPages={totalAlarms} onNext={() => this.nextAlarm()} onPrev={() => this.prevAlarm()} />
        <div className={styles.alarm}>
          <div className={styles.header}>
            <span>{__("alarm_id")}: {alarm.alarm_code}</span>
            <span>{formatDate(alarm.alarm_date)}</span>
          </div>
          <div className={styles.body}>
            <div className={styles.sidebar}>
              <div className={styles.logo}>
                <img src={`icons/${alarm.alarm_type}.svg`} />
              </div>
              <div className={styles.infoItem}>
                <label>{__("alarm_category")}</label>
                <p>{__(alarm.alarm_category)}</p>
              </div>
            </div>
            <div className={styles.content}>
                <div className={styles.infoBox}>
                  <label>{__("alarm_reason")}</label>
                  <div className={styles.content}>
                    <p>{__(alarm.alarm_description)}</p>
                  </div>
                </div>
                <div className={styles.infoBox}>
                  <label>{__("alarm_troubleshooting")}</label>
                  <div className={styles.content}>
                    <p>{__(alarm.alarm_solution)}</p>
                  </div>
                </div>
            </div>
          </div>
          <div className={`menu-button-bar ${styles.footer}`}>
            <button onClick={() => this.clearAlarm()} className={"button-bar__button"}>
              {__("back")}
            </button>
            <button disabled className={"button-bar__button"} />
            <button disabled className={"button-bar__button"} />
            <button onClick={() => this.switchStatus()} className={"button-bar__button"}>
              {__("switch")}
            </button>
          </div>
        </div>
      </React.Fragment>
    );
  }

  /* ==== MAIN ==== */
  /* ======================================== */

  render() {
    return (
      <React.Fragment>
        {!this.alarmIsSelected() ? <this.AlarmsTable /> : <this.AlarmDetail />}
      </React.Fragment>
    );
  }
}

/* SET ALARMS */
const withGlobalAlarms = Comp => props => (
  <ConfigConsumer>
    {(config: any) => (<Comp {...props} alarms={config.alarms}></Comp>)}
  </ConfigConsumer>
);

export default withGlobalAlarms(Alarms);