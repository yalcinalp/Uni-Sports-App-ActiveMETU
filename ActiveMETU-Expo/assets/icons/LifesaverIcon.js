import Svg, { Path } from 'react-native-svg';

function LifesaverIcon(props) {
  return (
    <Svg
      width={22}
      height={22}
      viewBox="0 0 22 22"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}>
      <Path
        d="M18.071 3.929l-3.929 3.929m3.93-3.93a10 10 0 00-14.143 0m14.142 0a10 10 0 010 14.143M14.142 7.858a4.444 4.444 0 00-6.284 0m6.284 0a4.444 4.444 0 010 6.284m0 0l3.93 3.93m-3.93-3.93a4.444 4.444 0 01-6.284 0m10.213 3.93a10 10 0 01-14.142 0M7.858 7.857l-3.93-3.93m3.93 3.93a4.444 4.444 0 000 6.284M3.928 3.93a10 10 0 000 14.142m3.93-3.929l-3.93 3.93"
        stroke="#D7CFFA"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export default LifesaverIcon;
