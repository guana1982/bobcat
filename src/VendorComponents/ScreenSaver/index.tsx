import * as React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

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
    // return (
    //   <div>
    //     <div
    //       onClick={this.props.onClick}
    //       style={{
    //         top: 0,
    //         left: 0,
    //         width: "100%",
    //         height: "100%",
    //         background: "#0000FF",
    //         position: "absolute",
    //         display: play ? "block" : "none",
    //         // zIndex: 1000,
    //         borderStyle: "solid",
    //         borderColor: "#fff",
    //         borderWidth: "120px 160px"
    //       }}
    //     />
    //     <FontAwesomeIcon icon="exclamation-triangle"
    //       style={{
    //         position: "absolute",
    //         bottom: "50px",
    //         right: "50px",
    //         color: "#000",
    //         fontSize: "1.8rem"
    //       }}
    //     />
    //   </div>
    // );
      return (
        <video
          ref={this.onRef}
          autoPlay
          style={{
            width: "100vw",
            height: "100vh",
            margin: "auto",
            display: play ? "block" : "none",
          }}
          src="video/7606603-preview.mp4"
          loop
          onClick={this.props.onClick}
        />
      );
  }
}
export default ScreenSaver;
