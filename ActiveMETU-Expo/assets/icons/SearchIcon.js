import Svg, { Path } from 'react-native-svg';

function SearchIcon(props) {
  return (
    <Svg
      width={24}
      height={24}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}>
      <Path
        d="M21.53 20.469l-4.694-4.694a8.26 8.26 0 10-1.06 1.06l4.693 4.695a.752.752 0 001.224-.244.75.75 0 00-.162-.817zm-17.78-9.97a6.75 6.75 0 116.75 6.75 6.757 6.757 0 01-6.75-6.75z"
        fill="#5A5A5A"
      />
    </Svg>
  );
}

export default SearchIcon;
