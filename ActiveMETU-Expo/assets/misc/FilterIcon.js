import Svg, { Path } from 'react-native-svg';

function FilterIcon(props) {
  return (
    <Svg
      width={24}
      height={24}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}>
      <Path
        d="M3.75 7a.75.75 0 01.75-.75h15a.75.75 0 110 1.5h-15A.75.75 0 013.75 7zm2.5 5a.75.75 0 01.75-.75h10a.75.75 0 110 1.5H7a.75.75 0 01-.75-.75zm3 5a.75.75 0 01.75-.75h4a.75.75 0 110 1.5h-4a.75.75 0 01-.75-.75z"
        fill="#5A5A5A"
      />
    </Svg>
  );
}

export default FilterIcon;
