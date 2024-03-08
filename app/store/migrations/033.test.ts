import migration from './033';
import { merge } from 'lodash';
import { captureException } from '@sentry/react-native';
import initialRootState from '../../util/test/initial-root-state';
const oldState1 = {
  engine: {
    backgroundState: {
      NetworkController: {
        providerConfig: {
          type: 'mainnet',
          chainId: '0x1',
          rpcUrl: 'https://api.avax.network/ext/bc/C/rpc',
          ticker: 'ETH',
        },
      },
      TokensController: {
        allTokens: {
          '1': { '0x123': { address: '0x123' }, '0x12': { address: '0x122' } },
          '0x1': {
            '0x123': { address: '0x123' },
            '0x1234': { address: '0x1234' },
          },
        },
        allIgnoredTokens: {
          '1': { '0x123': { address: '0x123' }, '0x12': { address: '0x122' } },
          '0x1': {
            '0x123': { address: '0x123' },
            '0x1234': { address: '0x1234' },
          },
        },
        allDetectedTokens: {
          '1': { '0x123': { address: '0x123' }, '0x12': { address: '0x122' } },
          '0x1': {
            '0x123': { address: '0x123' },
            '0x1234': { address: '0x1234' },
          },
        },
      },
      TokenRatesController: {
        contractExchangeRatesByChainId: {
          '1': { ETH: { '0x123': 0.0001 } },
          '0x1': { ETH: { '0x123': 0.0001 } },
        },
      },
      TokenListController: {
        tokensChainsCache: {
          '1': { timeStamp: 1, data: { '0x123': { address: '0x123' } } },
          '0x1': { timeStamp: 1, data: { '0x123': { address: '0x123' } } },
        },
      },
    },
  },
};

const oldState2 = {
  engine: {
    backgroundState: {
      NetworkController: {
        providerConfig: {
          type: 'mainnet',
          chainId: '0x1',
          rpcUrl: 'https://api.avax.network/ext/bc/C/rpc',
          ticker: 'ETH',
        },
      },
      TokensController: {
        allTokens: {
          '1': { '0x123': { address: '0x123' }, '0x12': { address: '0x122' } },
        },
        allIgnoredTokens: {
          '1': { '0x123': { address: '0x123' }, '0x12': { address: '0x122' } },
        },
        allDetectedTokens: {
          '1': { '0x123': { address: '0x123' }, '0x12': { address: '0x122' } },
        },
      },
      TokenRatesController: {
        contractExchangeRatesByChainId: {
          '1': { ETH: { '0x123': 0.0001 } },
        },
      },
      TokenListController: {
        tokensChainsCache: {
          '1': { timeStamp: 1, data: { '0x123': { address: '0x123' } } },
        },
      },
    },
  },
};

const expectedState1 = {
  engine: {
    backgroundState: {
      NetworkController: {
        providerConfig: {
          type: 'mainnet',
          chainId: '0x1',
          rpcUrl: 'https://api.avax.network/ext/bc/C/rpc',
          ticker: 'ETH',
        },
      },
      TokensController: {
        allTokens: {
          '0x1': {
            '0x123': { address: '0x123' },
            '0x1234': { address: '0x1234' },
          },
        },
        allIgnoredTokens: {
          '0x1': {
            '0x123': { address: '0x123' },
            '0x1234': { address: '0x1234' },
          },
        },
        allDetectedTokens: {
          '0x1': {
            '0x123': { address: '0x123' },
            '0x1234': { address: '0x1234' },
          },
        },
      },
      TokenRatesController: {
        contractExchangeRatesByChainId: {
          '0x1': { ETH: { '0x123': 0.0001 } },
        },
      },
      TokenListController: {
        tokensChainsCache: {
          '0x1': { timeStamp: 1, data: { '0x123': { address: '0x123' } } },
        },
      },
    },
  },
};

const expectedState2 = {
  engine: {
    backgroundState: {
      NetworkController: {
        providerConfig: {
          type: 'mainnet',
          chainId: '0x1',
          rpcUrl: 'https://api.avax.network/ext/bc/C/rpc',
          ticker: 'ETH',
        },
      },
      TokensController: {
        allTokens: {
          '0x1': {
            '0x123': { address: '0x123' },
            '0x12': { address: '0x122' },
          },
        },
        allIgnoredTokens: {
          '0x1': {
            '0x123': { address: '0x123' },
            '0x12': { address: '0x122' },
          },
        },
        allDetectedTokens: {
          '0x1': {
            '0x123': { address: '0x123' },
            '0x12': { address: '0x122' },
          },
        },
      },
      TokenRatesController: {
        contractExchangeRatesByChainId: {
          '0x1': { ETH: { '0x123': 0.0001 } },
        },
      },
      TokenListController: {
        tokensChainsCache: {
          '0x1': { timeStamp: 1, data: { '0x123': { address: '0x123' } } },
        },
      },
    },
  },
};

jest.mock('@sentry/react-native', () => ({
  captureException: jest.fn(),
}));
const mockedCaptureException = jest.mocked(captureException);

describe('Migration #32', () => {
  beforeEach(() => {
    jest.restoreAllMocks();
    jest.resetAllMocks();
  });

  const invalidStates = [
    {
      state: null,
      errorMessage: "Migration 33: Invalid state: 'object'",
      scenario: 'state is invalid',
    },
    {
      state: merge({}, initialRootState, {
        engine: null,
      }),
      errorMessage: "Migration 33: Invalid engine state: 'object'",
      scenario: 'engine state is invalid',
    },
    {
      state: merge({}, initialRootState, {
        engine: {
          backgroundState: null,
        },
      }),
      errorMessage: "Migration 33: Invalid engine backgroundState: 'object'",
      scenario: 'backgroundState is invalid',
    },
  ];

  for (const { errorMessage, scenario, state } of invalidStates) {
    it(`should capture exception if ${scenario}`, () => {
      const newState = migration(state);

      expect(newState).toStrictEqual(state);
      expect(mockedCaptureException).toHaveBeenCalledWith(expect.any(Error));
      expect(mockedCaptureException.mock.calls[0][0].message).toBe(
        errorMessage,
      );
    });
  }

  it('should convert to hexadecimal all the chain id values that are on decimal format to hexadecimal format if that hexadecimal value do not exist', () => {
    const newState = migration(oldState2);

    expect(newState).toStrictEqual(expectedState2);
  });

  it('should delete object that have decimal keys on their data, if the hexadecimal key of that decimal key already exists', () => {
    const newState = migration(oldState1);

    expect(newState).toStrictEqual(expectedState1);
  });
});
