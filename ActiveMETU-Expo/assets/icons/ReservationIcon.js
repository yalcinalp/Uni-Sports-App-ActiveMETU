import Svg, { Path } from 'react-native-svg';

const ReservationIcon = (props) => (
  <Svg xmlns="http://www.w3.org/2000/svg" width={26} height={27}>
    <Path
      fill={props.color || '#C9C7C5'}
      d="m18.743 9.303-4.129-4.122L16.66 3.1l2.083 2.08L23.894 0l2.083 2.08-7.234 7.223ZM0 26.815V3.465c0-.802.286-1.489.86-2.06A2.824 2.824 0 0 1 2.922.547h8.768v2.919H2.923v18.898l7.307-3.138 7.307 3.138V12.222h2.923v14.593l-10.23-4.378L0 26.815Z"
    />
  </Svg>
);
export default ReservationIcon;
