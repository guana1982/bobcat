import * as React from "react";

export interface AccessibilityInterface {

}

const AccessibilityContext = React.createContext<AccessibilityInterface | null>(null);

export const AccessibilityProvider = AccessibilityContext.Provider;
export const AccessibilityConsumer = AccessibilityContext.Consumer;

class AccessibilityStoreComponent extends React.Component<any, any> {

  constructor(props) {
    super(props);
  }

  render() {
    const { children } = this.props;
    return (
      <AccessibilityProvider
        value={{

        }}
      >
        {children}
      </AccessibilityProvider>
    );
  }

}

export const AccessibilityStore = AccessibilityStoreComponent;