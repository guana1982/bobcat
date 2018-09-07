import { compose, withState, withProps } from "recompose";
export default (query, { name, ...queryOptions }) =>
  compose(
    withState(name + "State", "__set" + name + "State", {
      loading: false,
      error: null,
      data: undefined
    }),
    withProps(ownProps => ({
      [name]: (...params) => {
        const updateState = ownProps["__set" + name + "State"];
        updateState(current => ({
          loading: true,
          error: null,
          data: current.data
        }));
        return query
          .apply(this, params)
          .then(res => {
            if (res.error || res.status === 1) {
              return updateState({
                loading: false,
                error: res.error,
                data: undefined
              });
            }
            updateState({
              loading: false,
              error: null,
              data: res
            });
            return res;
          })
          .catch(err => {
            updateState({
              loading: false,
              error: err,
              data: undefined
            });
            return err;
          });
      }
    }))
  );
