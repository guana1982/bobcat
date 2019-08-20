import * as React from "react";
import styled from "styled-components";
import { Box, ModalContentProps, Modal, ACTIONS_CLOSE, Action } from "@modules/service/components/common/Modal";
import { MButton, MTypes } from "@modules/service/components/common/Button";
import { ConfigContext, AuthLevels } from "@core/containers";
import { IAlarm } from "@core/models";
import { __ } from "@core/utils/lib/i18n";
import mediumLevel from "@core/utils/lib/mediumLevel";
import { finalize } from "rxjs/operators";
import { LoaderContext } from "@core/containers/loader.container";

const actionsAlarm = (authLevel, advancedMode, setAdvancedMode): Action[] => {

  if (authLevel !== AuthLevels.Super) {
    return ACTIONS_CLOSE;
  }

  const ACTION_STANDARD = {
    title: __("s_standard_menu"),
    event: () => setAdvancedMode(false)
  };

  const ACTION_ADVANCED = {
    title: __("s_advanced_menu"),
    event: () => setAdvancedMode(true)
  };

  const ACTION_STATUS = advancedMode ? ACTION_STANDARD : ACTION_ADVANCED;

  return [
    ACTION_STATUS,
    ...ACTIONS_CLOSE
  ];
};

const EquipmentStatusContent = styled.div`
  .alarms-group {
    height: 500px;
    overflow: auto;
    width: 900px;
    padding: 0;
    .alarm-element {
      display: flex;
      justify-content: space-between;
      align-items: center;
      .alarm-info {
        display: flex;
        align-items: center;
        div:nth-child(2) {
          margin-left: 20px;
        }
      }
      .alarm-actions {
        align-items: center;
        display: flex;
      }
    }
  }
`;

interface EquipmentStatusProps extends Partial<ModalContentProps> {
  authLevel: AuthLevels;
}

export const EquipmentStatus = (props: EquipmentStatusProps) => {

  const { cancel } = props;

  const configConsumer = React.useContext(ConfigContext);
  const loaderConsumer = React.useContext(LoaderContext);

  const [advancedMode, setAdvancedMode] = React.useState<boolean>(false);

  const { alarms, allAlarms } = configConsumer;
  alarms.sort((a, b) => +new Date(b.alarm_date) - +new Date(a.alarm_date));

  const ALARM_INIT = 0;
  const [alarmSelected, setAlarmSelected] = React.useState<IAlarm>({});

  React.useEffect(() => {
    const alarmIsPresent_ = alarms.find(alarm => alarm.alarm_name === alarmSelected.alarm_name);
    if (!alarmIsPresent_) {
      setAlarmSelected(alarms[ALARM_INIT] || null);
    } else {
      setAlarmSelected(alarmIsPresent_);
    }
  }, [alarms]);

  function enableAlarm(alarm: IAlarm) {
    loaderConsumer.show();
    mediumLevel.alarm.enableAlarm(alarm.alarm_name)
    .pipe(
      finalize(() => loaderConsumer.hide())
    )
    .subscribe();
  }

  function disableAlarm(alarm: IAlarm) {
    loaderConsumer.show();
    mediumLevel.alarm.disableAlarm(alarm.alarm_name)
    .pipe(
      finalize(() => loaderConsumer.hide())
    )
    .subscribe();
  }

  function resetAlarm(alarm: IAlarm) {
    loaderConsumer.show();
    mediumLevel.alarm.resetAlarm(alarm.alarm_name)
    .pipe(
      finalize(() => loaderConsumer.hide())
    )
    .subscribe();
  }

  const { authLevel } = props;

  if (advancedMode) {
    return (
      <Modal
        show={true}
        cancel={cancel}
        title="EQUIPMENT STATUS"
        actions={actionsAlarm(authLevel, advancedMode, setAdvancedMode)}
      >
        <EquipmentStatusContent>
          <Box className="container alarms-group">
            {
              allAlarms.map((alarm, i) => {
                return (
                  <Box key={i} className="container alarm-element">
                    <div className="alarm-info">
                      <div>
                        <MButton
                          className="small" info
                          key={i}
                          type={alarm.$info}
                        >
                          {alarm.alarm_code}
                        </MButton>
                      </div>
                      <div>
                        <p>NAME: {__(alarm.alarm_name)}</p>
                        <p>CODE: {alarm.alarm_code}</p>
                        <p>DATE: {new Date(alarm.alarm_date).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="alarm-actions">
                      <MButton
                        className="small"
                        onClick={() => resetAlarm(alarm)}
                      >
                        RESET
                      </MButton>
                      <MButton
                        className="small" info
                        type={!alarm.alarm_enable ? MTypes.INFO_WARNING : null}
                        onClick={() => alarm.alarm_enable ? disableAlarm(alarm) : enableAlarm(alarm)}
                      >
                        {alarm.alarm_enable ? "DISABLE" : "ENABLE"}
                      </MButton>
                    </div>
                  </Box>
                );
              })
            }
          </Box>
        </EquipmentStatusContent>
      </Modal>
    );
  }

  return (
    <Modal
      show={true}
      cancel={cancel}
      title="EQUIPMENT STATUS"
      actions={actionsAlarm(authLevel, advancedMode, setAdvancedMode)}
    >
      <>
        <div>
          {
            alarms.length === 0 &&
             <Box className="elements centered">
                <h1>No Alarms</h1>
             </Box>
          }
          {
            alarms.length > 0 &&
             <Box
              className="elements centered"
              style={{
                maxHeight: "280px",
                overflow: "scroll"
              }}
             >
              {
                allAlarms.map((alarm, i) => (
                  <MButton
                    className="small" info
                    light={alarm.alarm_name !== alarmSelected.alarm_name}
                    key={i}
                    onClick={() => setAlarmSelected(alarm)}
                    type={alarm.alarm_enable ? alarm.$info : null}
                  >
                    {alarm.alarm_code}
                  </MButton>
                ))
              }
             </Box>
          }
          {
            alarmSelected &&
            <Box className="container">
              <h2 id="title">info</h2>
              <h4>
                <p>NAME: {__(alarmSelected.alarm_name)}</p>
                <p>CODE: {alarmSelected.alarm_code}</p>
                <p>DATE: {new Date(alarmSelected.alarm_date).toLocaleDateString()}</p>
                <p>DESCRIPTION: {__(`${alarmSelected.alarm_code}_description`)}</p>
                <p>SOLUTION: {__(alarmSelected.alarm_solution)}</p>
                <p>STATUS: {alarmSelected.alarm_enable ? __("s_enabled") : __("s_disabled")}</p>
              </h4>
            </Box>
          }
        </div>
      </>
    </Modal>
  );
};