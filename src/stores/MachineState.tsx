import { action, observable, computed, runInAction, toJS } from "mobx";
import { StateNode, Machine } from "xstate";
import { fromDotNotation, toDotNotation } from "../lib/dotNotation";

class MachineStateStore {

  actions = null;
  reducers = null;
  machine = null;

  @observable state: any = {};
  @observable data: any = {};

  constructor(machine, actions?, reducers?, autostart = true, initialData?) {
    this.actions = actions;
    this.reducers = reducers;

    if (machine instanceof StateNode) {
      this.machine = machine;
    } else if (typeof machine === "object") {
      this.machine = Machine(machine);
    }

    if (!this.machine) {
      throw new Error("Invalid prop `machine`, expected an instance of StateNode or an object, got: %o"); // , machine
    }
    if (initialData && !autostart) {
      this.data = initialData;
    }
    if (autostart) this.dispatch("NEXT", initialData);
    return this;
  }

  toString() {
    return toDotNotation(toJS(this.currentState));
  }

  @computed
  get currentState() {
    return this.state.value || this.machine.initialState.value;
  }
  /*
     * allows to directly update the data without
     * the need to dispatch a transition event
     */
  @action
  update = (updater: any) => {
    this.data = updater(this.data);
    return this.data;
  }
  /*
     * alias to `this.dispatch`
     */
  transition = (to, data) => {
    return this.dispatch(to, data);
  }
  @action
  dispatch = (event: any, data: any) => {
    const nextState = this.machine.transition(this.currentState, event, { ...this.data, ...data });
    /*
         * Update final data, passing the data to a reducer function (if any)
         */
    let reducers;
    /*
         * If machine is parallel, search reducer with the
         * signature: state.event for each of the states
         */
    if (this.machine.parallel) {
      reducers = toDotNotation(this.toString()).map(name => fromDotNotation(this.reducers, `${name}.${event}`));
    } else {
      reducers = [fromDotNotation(this.reducers, `${toDotNotation(this.toString())}.${event}`)];
    }
    runInAction(() => {
      this.state = {
        ...nextState,
        event
      };
      /*
             * fire event actions: reverse order because they go from bottom
             * (first, ie. exit previous state) to top (last, ie. enter new state)
             */
      nextState.actions.reverse().forEach(actionName => {
        const actionFn = this.actions[`${actionName}`];
        if (typeof actionFn === "function") {
          actionFn(this.dispatch, this.update, data, this.data);
        }
      });
      /*
             * finally, apply the available reducer(s) for current transition
             * otherwise, simply update `this.data` with raw `data`.
             */
      reducers.forEach(reducer => {
        const nextData = typeof reducer === "function" ? reducer(data, this.data) : data;
        this.data = {
          ...this.data,
          ...nextData
        };
      });
    });
    return this.state;
  }
}
export default MachineStateStore;
