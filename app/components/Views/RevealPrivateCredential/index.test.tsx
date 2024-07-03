import React from 'react';
import { render } from '@testing-library/react-native';
import configureMockStore from 'redux-mock-store';
import { RevealPrivateCredential } from './';
import { Provider } from 'react-redux';
import initialBackgroundState from '../../../util/test/initial-background-state.json';

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useSelector: jest.fn(),
  useDispatch: jest.fn(),
}));

const mockStore = configureMockStore();
const initialState = {
  engine: {
    backgroundState: initialBackgroundState,
  },
  user: {
    passwordSet: false,
  },
};
const store = mockStore(initialState);

describe('RevealPrivateCredential', () => {
  it('should render correctly', () => {
    const { toJSON } = render(
      <Provider store={store}>
        <RevealPrivateCredential
          route={{
            params: {
              privateCredentialName: 'private_key',
            },
          }}
          navigation={null}
          cancel={() => null}
          credentialName={'private_key'}
        />
      </Provider>,
    );
    expect(toJSON()).toMatchSnapshot();
  });
});
