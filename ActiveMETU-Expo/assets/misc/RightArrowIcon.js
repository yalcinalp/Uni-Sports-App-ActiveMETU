import Svg, { Path } from 'react-native-svg';

function RightArrowIcon(props) {
  return (
    <Svg
      width={9}
      height={14}
      viewBox="0 0 9 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}>
      <Path
        d="M2 12l5-5-5-5"
        stroke="#D7CFFA"
        strokeWidth={3}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export default RightArrowIcon;
