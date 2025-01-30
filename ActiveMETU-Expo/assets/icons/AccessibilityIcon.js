import * as React from 'react';
import Svg, { Path } from 'react-native-svg';

function AccessibilityIcon(props) {
  return (
    <Svg
      width={24}
      height={24}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}>
      <Path
        d="M2 12a10 10 0 1020 0 10 10 0 00-20 0zM9.778 17L12 13.667m0 0L14.222 17M12 13.667v-2.222m0 0l3.333-1.111M12 11.444l-3.333-1.11"
        stroke="#D7CFFA"
        strokeWidth={2.7}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M12 8a1 1 0 100-2 1 1 0 000 2z"
        fill="#D7CFFA"
        stroke="#D7CFFA"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export default AccessibilityIcon;
