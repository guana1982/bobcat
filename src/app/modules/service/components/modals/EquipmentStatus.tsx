import * as React from "react";
import styled from "styled-components";
import { Box, ModalContentProps, Modal, ACTIONS_CLOSE, Action } from "@modules/service/components/common/Modal";
import { MButton, MTypes } from "@modules/service/components/common/Button";
import { ConfigContext } from "@core/containers";
import { IAlarm } from "@core/models";
import { __ } from "@core/utils/lib/i18n";
import mediumLevel from "@core/utils/lib/mediumLevel";
import { finalize } from "rxjs/operators";
import { LoaderContext } from "@core/containers/loader.container";

const actionsAlarm = (alarmSelected, enableAlarm_, disableAlarm_): Action[] => {
  if (!alarmSelected)
    return ACTIONS_CLOSE;

  const ACTION_ENABLE = {
    title: __("s_enable_alert"),
    event: enableAlarm_
  };

  const ACTION_DISABLE = {
    title: __("s_disable_alert"),
    event: disableAlarm_,
  };

  const ACTION_STATUS = alarmSelected.alarm_enable ? ACTION_DISABLE : ACTION_ENABLE;

  return [
    ACTION_STATUS,
    ...ACTIONS_CLOSE
  ];
};

const EquipmentStatusContent = styled.div`

`;

interface EquipmentStatusProps extends Partial<ModalContentProps> {}

export const EquipmentStatus = (props: EquipmentStatusProps) => {

  const { cancel } = props;

  const configConsumer = React.useContext(ConfigContext);
  const loaderConsumer = React.useContext(LoaderContext);

  const { alarms } = configConsumer;
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

  function enableAlarm_() {
    loaderConsumer.show();
    mediumLevel.alarm.enableAlarm(alarmSelected.alarm_name)
    .pipe(
      finalize(() => loaderConsumer.hide())
    )
    .subscribe();
  }

  function disableAlarm_() {
    loaderConsumer.show();
    mediumLevel.alarm.disableAlarm(alarmSelected.alarm_name)
    .pipe(
      finalize(() => loaderConsumer.hide())
    )
    .subscribe();
  }

  return (
    <Modal
      show={true}
      cancel={cancel}
      title="EQUIPMENT STATUS"
      actions={actionsAlarm(alarmSelected, enableAlarm_, disableAlarm_)}
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
             <Box className="elements centered">
              {
                alarms.map((alarm, i) => (
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
                <p>DESCRIPTION: {__(alarmSelected.alarm_description)}</p>
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