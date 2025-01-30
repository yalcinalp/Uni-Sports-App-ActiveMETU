import Svg, { Path } from 'react-native-svg';

function SettingsIcon(props) {
  return (
    <Svg
      width={24}
      height={24}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}>
      <Path
        d="M10 6.5a4.5 4.5 0 100 9 4.5 4.5 0 000-9zm0 7.5a3 3 0 110-6 3 3 0 010 6zm8.97-8.798L10.72.688a1.489 1.489 0 00-1.44 0L1.03 5.204a1.5 1.5 0 00-.78 1.312v8.966a1.5 1.5 0 00.78 1.313l8.25 4.516a1.489 1.489 0 001.44 0l8.25-4.516a1.5 1.5 0 00.78-1.313V6.517a1.5 1.5 0 00-.78-1.315zM10 20l-8.25-4.517V6.517L10 2l8.25 4.516v8.966L10 20z"
        fill="#5A5A5A"
      />
    </Svg>
  );
}

export default SettingsIcon;
