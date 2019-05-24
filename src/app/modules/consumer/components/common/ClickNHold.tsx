import * as React from "react";

// https://github.com/sonsoleslp/react-click-n-hold/blob/master/src/ClickNHold.jsx
export default class ClickNHold extends React.Component<any, any> {

    readonly state: any;
    readonly props: any;
    _timer: any;
    _unmounted: any;
    node: any;

    constructor(props) {
        super(props);
        this.state = {
            holding: false,
            start: 0,
            ended: "begin",
            clickEvent: null
        };

        this._timer = null;
        this._unmounted = false;

        this.start = this.start.bind(this);
        this.end = this.end.bind(this);
        this.clear = this.clear.bind(this);
        this.timeout = this.timeout.bind(this);
        this.clickCapture = this.clickCapture.bind(this);
    }

    componentWillUnmount() {
        this._unmounted = true;
        clearTimeout(this._timer);
        this._timer = null;
    }

    /*Start callback*/
    start(e) {
        let ended = this.state.ended;
        let start = Date.now();
        let eCopy = Object.assign({}, e);
        eCopy.type = "ClickNHold";
        this.setState({start: start, holding: true, ended: false, clickEvent: eCopy, isEnough: false});
        let rightNumber = this.props.time && this.props.time > 0;
        let time = rightNumber ? this.props.time : 2;
        if (!rightNumber) {
          console.warn("You have specified an unvalid time prop for ClickNHold. You need to specify a number > 0. Default time is 2.");
        }
        if (ended) {
          this._timer = setTimeout(function() {this.timeout(start); }.bind(this), time * 1000 + 1);
        }
        if (this.props.onStart) {
          this.props.onStart(e);
        }
        document.documentElement.addEventListener("mouseup", this.end);
    }

    /*End callback*/
    end(e) {
        document.documentElement.removeEventListener("mouseup", this.end);
        if (this.state.ended || this._unmounted) {
            return false;
        }
        let endTime = Date.now(); // End time
        let minDiff = this.props.time * 1000; // In seconds
        let startTime = this.state.start; // Start time
        let diff = endTime - startTime; // Time difference
        let isEnough = diff >= minDiff; // It has been held for enough time

        this.setState({holding: false, ended: true, clickEvent: null, isEnough: isEnough});
        if (this.props.onEnd) {
            this.props.onEnd(e, isEnough);
        }
        e.preventDefault();
    }

    clear(e) {
        clearTimeout(this._timer);
        this._timer = null;

        const { holding } = this.state;
        if (holding) {
            this.setState({holding: false, ended: true, clickEvent: null});
        }
    }

     clickCapture(e) {
         if (this.state.isEnough)
            e.stopPropagation();
     }

    /*Timeout callback*/
    timeout(start) {
        if (!this.state.ended && start === this.state.start) {
            if (this.props.onClickNHold) {
                this.props.onClickNHold(start, this.state.clickEvent);
                this.setState({ holding: false});
                return;
            }
        }
    }

    render() {
        let classList = this.props.className ? (this.props.className + " ") : " ";
        classList += this.state.holding ? "cnh_holding " : " ";
        classList += this.state.ended ? "cnh_ended " : " ";
        return (
            <div style={this.props.style}
                 className={classList}
                 onTouchStart={this.start}
                //  onMouseDown={this.start} // => DESKTOP MODE
                //  onMouseUp={this.end} // => DESKTOP MODE
                 onTouchMove={this.clear}
                 onClickCapture={this.clickCapture}
                 onTouchEnd={this.end}>
                {
                    typeof this.props.children === "object"
                        ? React.cloneElement(this.props.children, { ref: (n) => this.node = n })
                        : null
                }
            </div>);
    }
}