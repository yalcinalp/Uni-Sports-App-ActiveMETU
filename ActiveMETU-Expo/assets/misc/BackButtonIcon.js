import Svg, { Path } from 'react-native-svg';

function BackButtonIcon(props) {
  return (
    <Svg
      width={24}
      height={24}
      viewBox="0 0 24 24"
      stroke="black"
      strokeWidth={1.2}
      xmlns="http://www.w3.org/2000/svg"
      {...props}>
      <Path
        d="M15.53 18.97a.75.75 0 11-1.06 1.061l-7.5-7.5a.749.749 0 010-1.061l7.5-7.5a.75.75 0 111.06 1.061l-6.97 6.97 6.97 6.969z"
        fill="#5A5A5A"
      />
    </Svg>
  );
}

export default BackButtonIcon;
