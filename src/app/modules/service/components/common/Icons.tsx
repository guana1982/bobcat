import * as React from "react";
import withBlink from "@core/utils/enhancers/withBlink";

export const LoadingIcon = withBlink(({ width = 164, height = 164, blinkingIndex }) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 509.44 509.44">
      <g>
      	<g>
      		<circle cx="256" cy="414.663" r="42.667"/>
      	</g>
      </g>
      <g>
      	<g>
      		<path
            fill={blinkingIndex === 0 ? "inherit" : "#D9D9D9"}
            d="M191.602,281.305c-11.385,6.145-21.815,13.915-30.962,23.065h0.213c-9.143,9.136-16.905,19.557-23.04,30.933L166.4,363.89
c19.098-48.955,74.266-73.158,123.221-54.059c24.785,9.669,44.39,29.274,54.059,54.059l28.587-28.587
      			C337.289,270.503,256.402,246.327,191.602,281.305z"/>
      	</g>
      </g>
      <g>
      	<g>
      		<path
            fill={blinkingIndex === 1 ? "inherit" : "#D9D9D9"}
            d="M124.864,199.307c-11.255,7.885-21.773,16.773-31.424,26.556c-8.989,9.108-17.195,18.956-24.533,29.44l27.307,27.093
      			c58.135-87.835,176.468-111.912,264.304-53.777c21.354,14.133,39.643,32.423,53.776,53.777L441.6,255.09
      			C369.54,152.221,227.732,127.246,124.864,199.307z"/>
      	</g>
      </g>
      <g>
      	<g>
      		<path
            fill={blinkingIndex === 2 ? "inherit" : "#D9D9D9"}
            d="M57.31,120.23c-11.018,8.568-21.467,17.843-31.283,27.766c-9.242,9.073-17.933,18.69-26.027,28.8l27.307,27.307
      			c93.852-125.635,271.781-151.401,397.416-57.549c11.6,8.665,22.519,18.205,32.664,28.535c8.959,9.102,17.298,18.795,24.96,29.013
      			l27.307-27.307C400.362,36.265,197.841,10.939,57.31,120.23z"/>
      	</g>
    </g>
    </svg>
  );
});

export const WifiDisabledIcon = ({ width = 164, height = 164 }) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 509.44 509.44">
      <g>
        <g>
          <circle cx="256" cy="431.649" r="42.667" fill="#c2c2c2" />
        </g>
      </g>
      <g>
        <g>
          <path
            d="M111.573,103.969c-31.587,15.539-60.414,36.15-85.333,61.013c-9.315,9.067-18.077,18.684-26.24,28.8l27.307,27.307    c7.868-10.239,16.421-19.932,25.6-29.013c25.142-24.97,54.736-45.012,87.253-59.093L111.573,103.969z"
            fill="#c2c2c2"
          />
        </g>
      </g>
      <g>
        <g>
          <path d="M192,184.822c-50.004,13.969-93.595,44.89-123.307,87.467l27.52,27.093c29.213-44.278,75.635-74.297,128-82.773    L192,184.822z" fill="#c2c2c2" />
        </g>
      </g>
      <g>
        <g>
          <path d="M296.533,288.929c-61.43-20.099-128.414,6.911-158.72,64l28.587,28.587c19.11-48.95,74.284-73.139,123.234-54.029    c12.267,4.789,23.406,12.072,32.713,21.389C332.16,357.836,296.533,288.929,296.533,288.929z" fill="#c2c2c2" />
        </g>
      </g>
      <g>
        <g>
          <rect x="228.415" y="-77.121" transform="matrix(0.7071 -0.7071 0.7071 0.7071 -106.9645 251.2049)" width="42.667" height="663.683" fill="#c2c2c2" />
        </g>
      </g>
      <g>
        <g>
          <path d="M162.773,84.129l31.36,31.573c108.358-25.086,221.309,16.162,288,105.173l27.307-27.307    C427.836,88.621,289.843,45.057,162.773,84.129z" fill="#c2c2c2" />
        </g>
      </g>
      <g>
        <g>
          <path d="M256,175.649l42.667,43.947c34.699,7.711,66.505,25.093,91.733,50.133c9.082,9.042,17.23,18.977,24.32,29.653    l27.307-27.307C399.8,211.125,330.147,175.02,256,175.649z" fill="#c2c2c2" />
        </g>
      </g>
    </svg>
  );
};

export const SignalIcon = (props) => {
  const { power, active } = props;
  const db = 100 - Math.abs(Number(power.replace("dBm", "")));
  const ratio = Math.round(db / 100 * 5);
  return (
    <label>
      {[...Array(5).keys()].map((d, i) => {
        return (
          <div
            style={{
              display: "inline-block",
              marginRight: 2,
              width: 2,
              height: (i + 1) * 3,
              background: !active ? (i < ratio ? "#555" : "#ddd") : i < ratio ? "#fff" : "#999"
            }}
            key={i}
          />
        );
      })}
    </label>
  );
};

export const CheckmarkIcon = ({ width = 20, height = 20, fill = "inherit" }) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 24 24">
      <path fill={fill} d="M0 11.522l1.578-1.626 7.734 4.619 13.335-12.526 1.353 1.354-14 18.646z" />
    </svg>
  );
};

export const LockIcon = ({ width = 20, height = 20, fill = "inherit" }) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 24 24">
      <path fill={fill} d="M6 8v-2c0-3.313 2.686-6 6-6 3.312 0 6 2.687 6 6v2h-2v-2c0-2.206-1.795-4-4-4s-4 1.794-4 4v2h-2zm15 2v14h-18v-14h18zm-2 2h-14v10h14v-10z" />
    </svg>
  );
};