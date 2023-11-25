import Engine from '../../../Engine';
import FilesystemStorage from 'redux-persist-filesystem-storage';
import { persistReducer } from 'redux-persist';
import { combineReducers } from 'redux';
import { createAction } from '@reduxjs/toolkit';
import Logger from '../../../../util/Logger';

// const initialState = {
//   backgroundState: {} as any,
// };

const controllerNames = [
  { name: 'AccountTrackerController', initialState: {} },
  { name: 'AddressBookController', initialState: {} },
  { name: 'AssetsContractController', initialState: {} },
  { name: 'NftController', initialState: {} },
  { name: 'TokensController', initialState: {} },
  { name: 'TokenDetectionController', initialState: {} },
  { name: 'NftDetectionController', initialState: {} },
  {
    name: 'KeyringController',
    initialState: {},
  },
  { name: 'AccountTrackerController', initialState: {} },
  {
    name: 'NetworkController',
    initialState: {},
  },
  {
    name: 'PhishingController',
    initialState: {},
    denyList: ['phishing', 'whitelist'],
  },
  { name: 'PreferencesController', initialState: {} },
  { name: 'TokenBalancesController', initialState: {} },
  { name: 'TokenRatesController', initialState: {} },
  { name: 'TransactionController', initialState: {} },
  {
    name: 'SwapsController',
    initialState: {},
    denyList: [
      'aggregatorMetadata',
      'aggregatorMetadataLastFetched',
      'chainCache',
      'tokens',
      'tokensLastFetched',
      'topAssets',
      'topAssetsLastFetched',
    ],
  },
  {
    name: 'TokenListController',
    initialState: {},
    denyList: ['tokenList, tokensChainCache'],
  },
  {
    name: 'CurrencyRateController',
    initialState: {},
  },
  {
    name: 'GasFeeController',
    initialState: {},
  },
  {
    name: 'ApprovalController',
    initialState: {},
  },
  {
    name: 'PermissionController',
    initialState: {},
  },
  {
    name: 'LoggingController',
    initialState: {},
  },
];

// Create an action to initialize the background state
export const initBgState = createAction('INIT_BG_STATE', (key) => ({
  payload: key,
}));

// Create an action to update the background state
// export const updateBgState = createAction('UPDATE_BG_STATE', (key) => ({
//   payload: key,
// }));

export const updateBgState = createAction('UPDATE_BG_STATE', (key) => ({
  payload: key,
}));

const MigratedStorage = {
  async getItem(key: string) {
    try {
      const res = await FilesystemStorage.getItem(key);
      if (res) {
        // Using new storage system
        return res;
      }
    } catch (error) {
      Logger.error(error as Error, { message: 'Failed to run migration' });
      throw new Error('Failed Filesystem Storage fetch.');
    }
  },
  async setItem(key: string, value: string) {
    try {
      return await FilesystemStorage.setItem(key, value, Device.isIos());
    } catch (error) {
      Logger.error(error as Error, { message: 'Failed to set item' });
    }
  },
  async removeItem(key: string) {
    try {
      return await FilesystemStorage.removeItem(key);
    } catch (error) {
      Logger.error(error as Error, { message: 'Failed to remove item' });
    }
  },
};

const controllerPersistConfig = (controllerName: any, denyList?: string[]) => ({
  key: controllerName,
  blacklist: denyList,
  storage: MigratedStorage,
});

// engine: { backgroundState: { controller1Reducer, controller2Reducer}}
// engine: { backgroundState: []}
// engine: ....

const controllerReducer =
  ({
    controllerName,
    initialState,
  }: {
    controllerName: string;
    initialState: any;
  }) =>
  // eslint-disable-next-line @typescript-eslint/default-param-last
  (state = initialState, action: any) => {
    switch (action.type) {
      case initBgState(controllerName): {
        console.log('STATE: ', state);
        const initialEngineValue =
          Engine.state[controllerName as keyof typeof Engine.state];
        return { ...state, initialEngineValue };
      }
      case updateBgState(controllerName): {
        const newState = { ...state };
        // if (action.payload) {
        // newState[action.payload?.key] =
        //   Engine.state[action.payload.key as keyof typeof Engine.state];
        newState[controllerName] =
          Engine.state[controllerName as keyof typeof Engine.state];
        // }
        return newState;
      }
      default:
        return state;
    }
  };

const controllerReducers = controllerNames.reduce(
  (output, controllerConfig) => {
    const { name, initialState, denyList = [] } = controllerConfig;
    output[name] = persistReducer(
      //have these take objects
      controllerPersistConfig(name, denyList),
      controllerReducer({ name, initialState }),
    );
    return output;
  },
  {},
);

const engineReducer = combineReducers({
  backgroundState: combineReducers(controllerReducers),
});
// const engineReducer = (
//   // eslint-disable-next-line @typescript-eslint/default-param-last
//   state = initialState,
//   action: PayloadAction<{ key: any } | undefined>,
// ) => {
//   switch (action.type) {
//     case initBgState.type: {
//       return { backgroundState: Engine.state };
//     }
//     case updateBgState.type: {
//       const newState = { ...state };
//       if (action.payload) {
//         newState.backgroundState[action.payload?.key] =
//           Engine.state[action.payload.key as keyof typeof Engine.state];
//       }
//       return newState;
//     }
//     default:
//       return state;
//   }
// };

export default engineReducer;
