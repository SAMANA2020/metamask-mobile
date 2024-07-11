import React from 'react';
import { View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import AUTO_LOCK_OPTIONS, { AUTO_LOCK_SECTION } from './constants';
import { setLockTime } from '../../../../../../actions/settings';
import { useStyles } from '../../../../../../component-library/hooks';
import SelectComponent from '../../../../../UI/SelectComponent';
import Text, {
  TextVariant,
  TextColor,
} from '../../../../../../component-library/components/Texts/Text';
import { strings } from '../../../../../../../locales/i18n';
import styleSheet from './styles';

const AutoLock = () => {
  const { styles } = useStyles(styleSheet, {});
  const dispatch = useDispatch();

  // TODO: Replace "any" with type
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const lockTime = useSelector((state: any) => state.settings.lockTime);

  const selectLockTime = (time: string): void => {
    dispatch(setLockTime(parseInt(time, 10)));
  };

  return (
    <View style={styles.setting} testID={AUTO_LOCK_SECTION}>
      <Text variant={TextVariant.BodyLGMedium}>
        {strings('app_settings.auto_lock')}
      </Text>
      <Text
        variant={TextVariant.BodyMD}
        color={TextColor.Alternative}
        style={styles.desc}
      >
        {strings('app_settings.auto_lock_desc')}
      </Text>
      <View style={styles.picker}>
        <SelectComponent
          selectedValue={lockTime.toString()}
          onValueChange={selectLockTime}
          label={strings('app_settings.auto_lock')}
          options={AUTO_LOCK_OPTIONS}
        />
      </View>
    </View>
  );
};

export default AutoLock;
