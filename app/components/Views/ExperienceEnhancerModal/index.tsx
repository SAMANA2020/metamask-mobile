import React, { useRef } from 'react';
import { Linking, View } from 'react-native';
import { useDispatch } from 'react-redux';

import { strings } from '../../../../locales/i18n';
import BottomSheet, {
  BottomSheetRef,
} from '../../../component-library/components/BottomSheets/BottomSheet';
import Text, {
  TextVariant,
} from '../../../component-library/components/Texts/Text';
import createStyles from './styles';
import BottomSheetFooter, {
  ButtonsAlignment,
} from '../../../component-library/components/BottomSheets/BottomSheetFooter';
import Button, {
  ButtonSize,
  ButtonVariants,
} from '../../../component-library/components/Buttons/Button';
import { ButtonProps } from '../../../component-library/components/Buttons/Button/Button.types';
import { setDataCollectionForMarketing } from '../../../actions/security';
import {
  MetaMetricsEvents,
  useMetrics,
} from '../../../components/hooks/useMetrics';
import { HOW_TO_MANAGE_METRAMETRICS_SETTINGS } from '../../../constants/urls';
import ExperienceEhancerModalTestsIds from './index.constants';

const ExperienceEnhancerModal = () => {
  const dispatch = useDispatch();
  const styles = createStyles();
  const { trackEvent, addTraitsToUser } = useMetrics();
  const bottomSheetRef = useRef<BottomSheetRef>(null);

  const cancelButtonProps: ButtonProps = {
    variant: ButtonVariants.Secondary,
    label: strings('experience_enhancer_modal.cancel'),
    size: ButtonSize.Lg,
    onPress: () => {
      dispatch(setDataCollectionForMarketing(false));
      bottomSheetRef.current?.onCloseBottomSheet();

      const traits = {
        has_marketing_consent: false,
      };
      addTraitsToUser(traits);
      trackEvent(MetaMetricsEvents.ANALYTICS_PREFERENCE_SELECTED, {
        ...traits,
        location: 'marketing_consent_modal',
      });
    },
    testID: ExperienceEhancerModalTestsIds.CANCEL_BUTTON,
  };

  const acceptButtonProps: ButtonProps = {
    variant: ButtonVariants.Primary,
    label: strings('experience_enhancer_modal.accept'),
    size: ButtonSize.Lg,
    onPress: () => {
      dispatch(setDataCollectionForMarketing(true));
      bottomSheetRef.current?.onCloseBottomSheet();

      const traits = { has_marketing_consent: true };
      addTraitsToUser(traits);
      trackEvent(MetaMetricsEvents.ANALYTICS_PREFERENCE_SELECTED, {
        ...traits,
        location: 'marketing_consent_modal',
      });
    },
    testID: ExperienceEhancerModalTestsIds.ACCEPT_BUTTON,
  };

  return (
    <BottomSheet
      ref={bottomSheetRef}
      testID={ExperienceEhancerModalTestsIds.BOTTOM_SHEET}
    >
      <Text
        variant={TextVariant.HeadingMD}
        style={styles.title}
        testID={ExperienceEhancerModalTestsIds.TITLE}
      >
        {strings('experience_enhancer_modal.title')}
      </Text>
      <View
        style={styles.content}
        testID={ExperienceEhancerModalTestsIds.CONTENT}
      >
        <Text variant={TextVariant.BodyMD}>
          {strings('experience_enhancer_modal.paragraph1a')}
          <Button
            variant={ButtonVariants.Link}
            label={strings('experience_enhancer_modal.link')}
            onPress={() => Linking.openURL(HOW_TO_MANAGE_METRAMETRICS_SETTINGS)}
            testID={ExperienceEhancerModalTestsIds.LINK_BUTTON}
          />
          {strings('experience_enhancer_modal.paragraph1b')}
        </Text>

        <Text
          variant={TextVariant.BodyMD}
          testID={ExperienceEhancerModalTestsIds.PARAGRAPH_2}
        >
          {strings('experience_enhancer_modal.paragraph2')}
        </Text>
        <View style={styles.list}>
          <Text
            style={styles.line}
            testID={ExperienceEhancerModalTestsIds.BULLET_1}
          >
            <Text style={styles.dot}>•</Text>{' '}
            {strings('experience_enhancer_modal.bullet1')}
          </Text>
          <Text
            style={styles.line}
            testID={ExperienceEhancerModalTestsIds.BULLET_2}
          >
            <Text style={styles.dot}>•</Text>{' '}
            {strings('experience_enhancer_modal.bullet2')}
          </Text>
          <Text
            style={styles.line}
            testID={ExperienceEhancerModalTestsIds.BULLET_3}
          >
            <Text style={styles.dot}>•</Text>{' '}
            {strings('experience_enhancer_modal.bullet3')}
          </Text>
        </View>
        <Text
          variant={TextVariant.BodyMD}
          testID={ExperienceEhancerModalTestsIds.FOOTER}
        >
          {strings('experience_enhancer_modal.footer')}
        </Text>
        <BottomSheetFooter
          buttonsAlignment={ButtonsAlignment.Horizontal}
          buttonPropsArray={[cancelButtonProps, acceptButtonProps]}
        />
      </View>
    </BottomSheet>
  );
};

export default ExperienceEnhancerModal;