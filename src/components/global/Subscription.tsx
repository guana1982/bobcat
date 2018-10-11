import { createSubscription } from "create-subscription";

export const ReplaySubscription = createSubscription({
  getCurrentValue: replaySubject => {
    let currentValue;
    // ReplaySubject does not have a sync data getter,
    // So we need to temporarily subscribe to retrieve the most recent value.
    replaySubject
      .subscribe(value => {
        currentValue = value;
      })
      .unsubscribe();
    return currentValue;
  },
  subscribe: (replaySubject, callback) => {
    const subscription = replaySubject.subscribe(callback);
    return () => subscription.unsubscribe();
  }
});
