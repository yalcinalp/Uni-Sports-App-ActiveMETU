import Svg, { Path } from 'react-native-svg';

function ShieldIcon(props) {
  return (
    <Svg
      width={20}
      height={24}
      viewBox="0 0 20 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}>
      <Path
        d="M10 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"
        stroke="#D7CFFA"
        strokeWidth={3}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export default ShieldIcon;
