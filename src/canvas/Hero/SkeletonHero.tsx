import { FC } from 'react';
import classNames from 'classnames';
import { Container, SideImage } from './atoms';
import { DEFAULT_TEXT_COLOR } from './';

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
          <h1 className={classNames('font-bold text-4xl md:text-5xl py-2')}>Your brewski is brewing....</h1>
          <div className={classNames('whitespace-break-spaces py-10')}>is almost there</div>
        </div>
      </div>
    </Container>
  );
};
