import * as React from "react";
import { observable, toJS } from "mobx";
import { observer } from "mobx-react";
import {
  compose,
  withHandlers,
  withProps,
  withState,
  setDisplayName
} from "recompose";
const navigationStores = {};
const createNavigator = (id, initialPath, initialState) => {
  navigationStores[id] = observable([
    {
      path: initialPath,
      state: initialState
    }
  ]);
  return navigationStores[id];
};
export default (routes, { name, initialPath, initialState = {} }) =>
  compose(
    setDisplayName("Navigator"),
    withState("direction", "setDirection", 1),
    withProps({
      navigation: createNavigator(name, initialPath, initialState)
    }),
    withHandlers({
      push: ({ navigation, setDirection }) => (path, state) => {
        setDirection(1, () => {
          navigation.push({ path, state });
        });
      },
      pop: ({ navigation, setDirection }) => () => {
        setDirection(-1, () => {
          if (navigation.length > 1) {
            navigation.pop();
          }
        });
      },
      jumpTo: ({ navigation, setDirection }) => (path, state) => {
        const index = navigation.map(r => r.path).indexOf(path);
        setDirection(index > -1 ? -1 : 1, () => {
          navigation.replace(navigation.slice(0, index + 1));
        });
      },
      replacePath: ({ navigation, setDirection }) => (path, state) => {
        const index = navigation.map(r => r.path).indexOf(path);
        setDirection(index > -1 ? -1 : 1, () => {
          navigation.replace(
            navigation.slice(0, -1).concat({
              path,
              state
            })
          );
        });
      },
      replaceAt: ({ navigation, setDirection }) => (index, path, state = {}) => {
        const originalState = navigation[index].state;
        setDirection(-1, () => {
          navigation.replace(
            navigation.slice(0, index).concat({
              path,
              state: { ...originalState, ...state }
            })
          );
        });
      },
      reset: ({ navigation, setDirection }) => () => {
        setDirection(-1, () => {
          navigation.replace([{ path: initialPath, state: initialState }]);
        });
      }
    }),
    Root =>
      observer(
        ({
          direction,
          navigation,
          pop,
          replacePath,
          replaceAt,
          jumpTo,
          push,
          reset,
          ...rest
        }) => {
          const { path: currentPath, state } = navigation.slice(-1)[0];
          const route = routes.find(({ path }) => path === currentPath);
          // props to be injected to Root component
          const props = {
            navigation: {
              pop,
              replacePath,
              replaceAt,
              jumpTo,
              push,
              reset,
              history: toJS(navigation),
              current: route,
              direction
            },
            ...rest
          };
          return <Root {...props}>{route.render({ props, state })}</Root>;
        }
      )
  );
