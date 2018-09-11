import * as React from "react";

class ScreenSaver extends React.Component<any, any> { // {}, {}
  componentDidMount() {
    // setTimeout(() => {
    //   this.video.play()
    // }, 0)
  }
  componentWillUnmount() {
    // this.video.pause()
    // this.video.src = ''
  }
  UNSAFE_componentWillReceiveProps(nextProps) {
    // if (!nextProps.play && this.props.play) {
    //   this.video.pause()
    //   this.video.currentTime = 0
    // }
    //
    // if (nextProps.play && !this.props.play) {
    //   this.video.play()
    // }
  }
  onRef = el => {
    // if (el) this.video = el
  }
  render() {
    const { play } = this.props;
    return (
      <div
        onClick={this.props.onClick}
        style={{
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          background: "#0000FF",
          position: "absolute",
          display: play ? "block" : "none",
          zIndex: 1000
        }}
      />
    );
    //   return (
    //     <video
    //       ref={this.onRef}
    //       style={{
    //         width: '100%',
    //         height: 'auto !important',
    //         minHeight: '100%',
    //         background: '#05396A',
    //         display: play ? 'block' : 'none',
    //       }}
    //       src="pepsi/video/video-subway-2.mp4"
    //       loop
    //       onClick={this.props.onClick}
    //     />
    //   )
  }
}
export default ScreenSaver;
