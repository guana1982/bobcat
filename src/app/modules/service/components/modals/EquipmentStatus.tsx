import * as React from "react";
import styled from "styled-components";
import { Box, ModalContentProps, Modal, ACTIONS_CLOSE } from "@modules/service/components/common/Modal";
import { MButton, MTypes } from "@modules/service/components/common/Button";
import { ConfigContext } from "@core/containers";
import { IAlarm } from "@core/models";
import { __ } from "@core/utils/lib/i18n";

const EquipmentStatusContent = styled.div`

`;

interface EquipmentStatusProps extends Partial<ModalContentProps> {}

export const EquipmentStatus = (props: EquipmentStatusProps) => {

  const { cancel } = props;

  const configConsumer = React.useContext(ConfigContext);

  const { alarms } = configConsumer;
  alarms.sort((a, b) => +new Date(b.alarm_date) - +new Date(a.alarm_date));

  const ALARM_INIT = 0;
  const [alarmSelected, setAlarmSelected] = React.useState<IAlarm>(null);

  React.useEffect(() => {
    setAlarmSelected(alarms[ALARM_INIT] || null);
  }, [alarms]);

  return (
    <Modal
      show={true}
      cancel={cancel}
      title={__("s_equipment_status")}
      actions={ACTIONS_CLOSE}
    >
      <>
        <div>
          {
            alarms.length === 0 &&
             <Box className="elements centered">
                <h1>{__("s_no_alarms")}</h1>
             </Box>
          }
          {
            alarms.length > 0 &&
             <Box className="elements centered">
              {
                alarms.map((alarm, i) => (
                  <MButton
                    className="small" info
                    light={alarm !== alarmSelected}
                    key={i}
                    onClick={() => setAlarmSelected(alarm)}
                    type={alarm.$info}
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
              <h2 id="title">{__("s_info")}</h2>
              <h4>
                <p>{__("s_alarm_name")}: {__(alarmSelected.alarm_name)}</p>
                <p>{__("s_alarm_code")}: {alarmSelected.alarm_code}</p>
                <p>{__("s_alarm_date")}: {new Date(alarmSelected.alarm_date).toLocaleDateString()}</p>
                <p>{__("s_alarm_description")}: {__(alarmSelected.alarm_description)}</p>
                <p>{__("s_alarm_solution")}: {__(alarmSelected.alarm_solution)}</p>
              </h4>
            </Box>
          }
        </div>
      </>
    </Modal>
  );
};