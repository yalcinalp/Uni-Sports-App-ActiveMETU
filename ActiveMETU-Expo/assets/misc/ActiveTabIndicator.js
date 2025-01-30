import Svg, { Path } from 'react-native-svg';

function ActiveTabIndicator(props) {
  return (
    <Svg
      width={56}
      height={8}
      viewBox="0 0 56 8"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}>
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M0 9c.267-.015.537-.031.808-.05H28V.062c-1.5-.282-6 .254-12 4.656C12.276 7.45 6.175 8.584.808 8.95H0V9zM56 9a61.33 61.33 0 01-.808-.05H28V.062c1.5-.282 6 .254 12 4.656 3.724 2.732 9.825 3.866 15.192 4.232H56V9z"
        fill="#FF862A"
      />
    </Svg>
  );
}

export default ActiveTabIndicator;
