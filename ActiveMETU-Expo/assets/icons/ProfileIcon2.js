import Svg, { Path } from 'react-native-svg';

// TODO: Rename file-component
function ProfileIcon2(props) {
  return (
    <Svg
      width={14}
      height={21}
      viewBox="0 0 14 21"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}>
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M4.963 5.415a1.963 1.963 0 113.927 0 1.963 1.963 0 01-3.927 0zM6.926.452a4.963 4.963 0 100 9.927 4.963 4.963 0 000-9.927zM4.33 15.342h5.195a1.329 1.329 0 110 2.658H4.329a1.329 1.329 0 110-2.658zm5.195-3H4.329a4.329 4.329 0 100 8.658h5.195a4.329 4.329 0 000-8.658z"
        fill={props.color || '#000'}
      />
    </Svg>
  );
}

export default ProfileIcon2;
