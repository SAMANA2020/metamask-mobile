import Engine from '../../../core/Engine';
import { persistReducer } from 'redux-persist';
import { combineReducers, Reducer } from 'redux';
import createPersistConfig from '../../../store/persistConfig';
import { cloneDeep } from 'lodash';

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
  ///: BEGIN:ONLY_INCLUDE_IF(snaps)
  { name: 'SnapController', initialState: {} },
  ///: END:ONLY_INCLUDE_IF
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
  {
    name: 'PPOMController',
    initialState: {},
  },
];

const legacySubscribeControllers = ['TransactionController'];

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
      case `INIT_BG_STATE_${controllerName || action.key}`: {
        const initialEngineValue =
          Engine.state[controllerName as keyof typeof Engine.state];
        const returnedState = {
          ...state,
          ...initialEngineValue,
        };

        return returnedState;
      }
      case `UPDATE_BG_STATE_${controllerName}`: {
        const newState =
          Engine.state[controllerName as keyof typeof Engine.state];

        // The BaseControllerV1 controllers modify the original state object on update,
        // rather than replacing it as done in BaseControllerV2.
        // This introduces two issues:
        // - Memoized selectors do not fire on nested objects since the references don't change.
        // - Deep comparison selectors do not fire since the cached objects are references to the original
        //  state object which has been mutated.
        // This is resolved by doing a deep clone in this scenario to force an entirely new object.
        return legacySubscribeControllers.includes(controllerName)
          ? cloneDeep(newState)
          : { ...newState };
      }
      default:
        return state;
    }
  };

export const controllerReducers = controllerNames.reduce(
  (output, controllerConfig) => {
    const { name, initialState, denyList = [] } = controllerConfig;

    const reducer = persistReducer(
      createPersistConfig({ key: name, blacklist: denyList }),
      controllerReducer({ controllerName: name, initialState }),
    );

    output[name] = reducer;
    return output;
  },
  {} as Record<string, Reducer<any, any>>,
);

const engineReducer = combineReducers({
  backgroundState: combineReducers(controllerReducers),
});

/**
 * Engine Reducer
 *
 * Note: This reducer is not yet using RTK (Redux Toolkit) slice.
 *
 * @param {object} state - The current state.
 * @param {object} action - The dispatched action.
 * @returns {object} - new state.
 */
export default engineReducer;
