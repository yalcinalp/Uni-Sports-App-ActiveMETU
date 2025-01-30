import { render, screen } from '@testing-library/react-native';
import Test from 'Tests/Test';

it('Should render the sample text', () => {
  render(<Test />);

  screen.getByText('Test Text');
});
