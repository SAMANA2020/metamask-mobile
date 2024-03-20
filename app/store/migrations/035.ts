import { hasProperty, isObject } from '@metamask/utils';
import migration29 from './029';
import { captureException } from '@sentry/react-native';

/**
 * This migraiton re-applies migration 29 to the users impacted to this Sentry issue:
 * https://github.com/MetaMask/metamask-mobile/issues/9010
 * @param {any} state - Redux state.
 * @returns Migrated Redux state.
 */
export default async function migrate(stateAsync: unknown) {
  const state = await stateAsync;

  if (!isObject(state)) {
    captureException(
      new Error(`Migration 35: Invalid state: '${typeof state}'`),
    );
    return {};
  }

  if (!isObject(state.engine)) {
    captureException(
      new Error(`Migration 35: Invalid engine state: '${typeof state.engine}'`),
    );
    const { engine, ...restState } = state;
    return restState;
  }

  if (!isObject(state.engine.backgroundState)) {
    captureException(
      new Error(
        `Migration 35: Invalid engine backgroundState: '${typeof state.engine
          .backgroundState}'`,
      ),
    );
    const { engine, ...restState } = state;
    return restState;
  }

  const networkControllerState = state.engine.backgroundState.NetworkController;

  if (!isObject(networkControllerState)) {
    captureException(
      new Error(
        `Migration 35: Invalid NetworkController state: '${typeof networkControllerState}'`,
      ),
    );
    return state;
  }

  if (
    !hasProperty(networkControllerState, 'providerConfig') ||
    !isObject(networkControllerState.providerConfig)
  ) {
    captureException(
      new Error(
        `Migration 35: Invalid NetworkController providerConfig: '${typeof networkControllerState.providerConfig}'`,
      ),
    );
    return state;
  }

  if (networkControllerState?.providerConfig?.rpcUrl) {
    return state;
  }

  const state29 = migration29(state);

  return state29;
}
