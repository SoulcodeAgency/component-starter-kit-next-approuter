'use client';

import { FC, useState, useEffect, useCallback } from 'react';
import classNames from 'classnames';
import { UniformSlot } from '@uniformdev/canvas-next-rsc/component';
import { CompositionContext } from '@uniformdev/canvas-next-rsc/component';
import { SlotDefinition } from '@uniformdev/canvas-next-rsc-shared';
import { ComponentInstance } from '@uniformdev/canvas';
import useLockScroll from '../../../hooks/useLockScroll';

type Props = {
  wrapperClassName?: string;
  logo?: React.ReactNode;
  component: ComponentInstance;
  slots: Record<'links' | 'iconLinks', SlotDefinition>;
  context: CompositionContext;
};

export const MobileView: FC<Props> = ({ wrapperClassName, logo, component, context, slots }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { toggleLockScroll } = useLockScroll();

  const toggleMenu = useCallback(() => setIsMenuOpen(prevState => !prevState), []);

  const { previewMode } = context || {};
  const isContextualEditing = previewMode === 'editor';

  const isChildComponentSelected = false;

  useEffect(() => {
    if (!isContextualEditing) {
      toggleLockScroll(isMenuOpen);
    }
  }, [toggleLockScroll, isContextualEditing, isMenuOpen]);

  const isMenuOpened = isContextualEditing ? isChildComponentSelected : isMenuOpen;

  const renderToggleButton = () => (
    <button onClick={toggleMenu} tabIndex={0} className="btn btn-ghost hover:bg-transparent px-0 lg:hidden">
      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" />
      </svg>
    </button>
  );

  return (
    <div className="relative">
      {renderToggleButton()}
      {isMenuOpened && (
        <ul
          tabIndex={0}
          className={classNames('fixed top-0 left-0 h-screen w-screen z-50 px-4 py-2', wrapperClassName)}
        >
          <div className="flex">
            {renderToggleButton()}
            {logo}
          </div>
          <div className="flex flex-col items-center gap-y-4 !text-xl mt-4">
            <UniformSlot context={context} slot={slots.links} data={component} />
          </div>
          <div className="flex justify-center items-center gap-x-4 !text-xl mt-4 [&_.dropdown>ul]:fixed [&_.dropdown>ul]:left-0">
            <UniformSlot context={context} slot={slots.iconLinks} data={component} />
          </div>
        </ul>
      )}
    </div>
  );
};
