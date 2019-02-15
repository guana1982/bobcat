import * as React from "react";

interface CleaningProps {}

interface CleaningState {}

class CleaningComponent extends React.Component<CleaningProps, CleaningState> {

  readonly state: CleaningState;

  constructor(props) {
    super(props);
  }

  componentDidMount() {

  }

  componentWillUnmount() {

  }

  render() {
    return (
      <div>
        <h1>Cleaning</h1>
      </div>
    );
  }
}

export default CleaningComponent;
