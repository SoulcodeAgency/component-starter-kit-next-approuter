import { FC } from 'react';
import classNames from 'classnames';

import { Container, SideImage } from './atoms';
import { DEFAULT_TEXT_COLOR } from './';
import { getTextClass } from '@/utilities/styling';

export const SkeletonHero: FC = async ({}) => {
  const currentColor = DEFAULT_TEXT_COLOR;
  const baseTextStyle = '#000';
  const heroContentClass = 'flex-col lg:flex-row';

  return (
    <Container
      fullHeight={false}
      className={classNames({ [baseTextStyle]: !currentColor })}
      backgroundType={'#fff'}
      containerVariant={'fluidContent'}
    >
      <div
        className={classNames('hero-content text-center p-0', heroContentClass, {
          'h-full items-start pt-20': false,
        })}
        style={{ color: currentColor }}
      >
        <SideImage image={'/placeholder.svg'} />
        <div className={classNames('flex flex-col mx-1 md:mx-10 z-20 text-start')}>
          <div className={classNames('font-bold tracking-wider uppercase my-3 text-sm text-primary')}>
            We are brewing somethin
          </div>
          <h1 className={classNames('py-2 font-bold', getTextClass('h1'))}>Your brew....</h1>
          <div className={classNames('whitespace-break-spaces py-6')}>is almost there</div>
          {/*           
            {(Boolean(primaryButtonCopy)) && (
              <PrimaryButton
                component={component}
                context={context}
                animationType={primaryButtonAnimationType}
                primaryButtonLink={primaryButtonLink}
                primaryButtonStyle={primaryButtonStyle}
              />
            )}
            {(Boolean(secondaryButtonCopy)) && (
              <SecondaryButton
                component={component}
                context={context}
                animationType={secondaryButtonAnimationType}
                secondaryButtonLink={secondaryButtonLink}
                secondaryButtonStyle={secondaryButtonStyle}
              />
            )} */}
        </div>
      </div>
    </Container>
  );
};
