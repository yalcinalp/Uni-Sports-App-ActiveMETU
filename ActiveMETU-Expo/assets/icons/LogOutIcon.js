import Svg, { Path } from 'react-native-svg';

function LogOutIcon(props) {
  return (
    <Svg
      width={24}
      height={24}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}>
      <Path
        d="M16.445 17.555L22 12l-5.555-5.556M22 12H8.667M8.667 22H4.222A2.222 2.222 0 012 19.778V4.222A2.222 2.222 0 014.222 2h4.445"
        stroke={props.color || '#D7CFFA'}
        strokeWidth={3}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export default LogOutIcon;
