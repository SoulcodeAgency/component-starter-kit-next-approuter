import { FC } from 'react';
import classNames from 'classnames';

import { Container, Description, EyebrowText, PrimaryButton, SecondaryButton, SideImage, Title } from './atoms';
import { HeroProps, DEFAULT_TEXT_COLOR } from './';
import { REGEX_COLOR_HEX } from '../../utilities';
import { getHeroTextStyle } from './helpers';

export const BeerRecommendationHero: FC<HeroProps> = async ({
  title,
  titleStyle = 'h1',
  description,
  image,
  video,
  primaryButtonCopy,
  primaryButtonLink,
  primaryButtonStyle = 'primary',
  primaryButtonAnimationType,
  secondaryButtonCopy,
  secondaryButtonLink,
  secondaryButtonStyle = 'primary',
  secondaryButtonAnimationType,
  overlayOpacity,
  overlayColor,
  objectFit,
  useCustomTextElements = false,
  fullHeight,
  backgroundColor,
  containerVariant,
  paddingBottom,
  paddingTop,
  marginBottom,
  marginTop,
  textColor = DEFAULT_TEXT_COLOR,
  styles,
  component,
  context,
}) => {
  const { isContextualEditing } = context || {};
  const currentColor = REGEX_COLOR_HEX.test(textColor || DEFAULT_TEXT_COLOR) ? textColor : undefined;
  const baseTextStyle = getHeroTextStyle(textColor);
  const heroContentClass = 'flex-col lg:flex-row';
  return (
    <Container
      fullHeight={fullHeight}
      className={classNames({ [baseTextStyle]: !currentColor })}
      paddingBottom={paddingBottom}
      paddingTop={paddingTop}
      marginBottom={marginBottom}
      marginTop={marginTop}
      backgroundType={backgroundColor}
      containerVariant={containerVariant}
    >
      <div
        className={classNames('hero-content text-center p-0', heroContentClass, {
          'h-full items-start pt-20': fullHeight,
        })}
        style={{ color: currentColor }}
      >
        <SideImage
          video={video}
          image={image}
          objectFit={objectFit}
          overlayColor={overlayColor}
          overlayOpacity={overlayOpacity}
          className={styles?.sideImage}
        />

        <div className={classNames('flex flex-col mx-1 md:mx-10 z-20 text-start', styles?.textAlign)}>
          <EyebrowText
            component={component}
            context={context}
            className={classNames('text-primary', styles?.eyebrowText)}
          />
          <Title
            component={component}
            context={context}
            className={classNames('py-2', styles?.title)}
            titleStyle={titleStyle}
            useCustomTextElements={useCustomTextElements}
            title={title}
          />
          <Description component={component} context={context} className={classNames('py-10', styles?.description)} />
          <div className={classNames('pb-6', { 'py-6': !description })}>
            {(Boolean(primaryButtonCopy) || isContextualEditing) && (
              <PrimaryButton
                component={component}
                context={context}
                animationType={primaryButtonAnimationType}
                primaryButtonLink={primaryButtonLink}
                primaryButtonStyle={primaryButtonStyle}
              />
            )}
            {(Boolean(secondaryButtonCopy) || isContextualEditing) && (
              <SecondaryButton
                component={component}
                context={context}
                animationType={secondaryButtonAnimationType}
                secondaryButtonLink={secondaryButtonLink}
                secondaryButtonStyle={secondaryButtonStyle}
              />
            )}
          </div>
        </div>
      </div>
    </Container>
  );
};
