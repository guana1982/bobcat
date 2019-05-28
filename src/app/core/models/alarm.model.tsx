import { MTypes } from "@modules/service/components/common/Button";

export interface IAlarm {
  alarm_code?: string;
  alarm_category?: string;
  alarm_name?: string;
  alarm_date?: string;
  alarm_state?: boolean;
  alarm_description?: string;
  alarm_type?: string;
  alarm_solution?: string;
  alarm_enable?: boolean;
  $info?: MTypes;
}