import Svg, { Path } from 'react-native-svg';

const ProfileIcon = (props) => (
  <Svg xmlns="http://www.w3.org/2000/svg" width={22} height={25}>
    <Path
      fill={props.color || '#C9C7C5'}
      stroke={props.color || '#C9C7C5'}
      strokeWidth={2}
      d="M15.964 6.25a5.247 5.247 0 0 1-5.25 5.25 5.247 5.247 0 0 1-5.25-5.25A5.247 5.247 0 0 1 10.714 1a5.247 5.247 0 0 1 5.25 5.25Zm-5.25 9.929a9.752 9.752 0 0 0 4.045-.893H15a5.43 5.43 0 0 1 5.429 5.428v1.607A1.68 1.68 0 0 1 18.75 24H2.679A1.68 1.68 0 0 1 1 22.321v-1.607a5.43 5.43 0 0 1 5.429-5.428h.242a9.762 9.762 0 0 0 4.043.893Z"
    />
  </Svg>
);
export default ProfileIcon;
