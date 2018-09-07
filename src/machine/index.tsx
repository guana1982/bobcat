import { actions as vendorActions } from "../VendorMachine/actions";
import { reducers as vendorReducers } from "../VendorMachine/reducers";
import { statechart as vendorStatechart } from "../VendorMachine/statechart";

import { actions as defaultActions } from "./actions";
import { reducers as defaultReducers } from "./reducers";
import { statechart as defaultStatechart } from "./statechart";

export const actions = {
  ...defaultActions,
  ...vendorActions
};

export const reducers = {
  ...defaultReducers,
  ...vendorReducers
};

export const statechart = Object.keys(vendorStatechart).length
  ? vendorStatechart
  : defaultStatechart;

console.log("statechart", statechart);
