import { ComponentProps } from '@uniformdev/canvas-next-rsc/component';
import { AccordionItem } from './AccordionItem';
import { ResolveComponentResultWithType } from '@/components/BeerRecommendation/BeerRecommendation';

type Styles = {
  container?: string;
  toggleButton?: string;
  title?: string;
  description?: string;
};

export type AccordionItemProps = ComponentProps<{
  title: string;
  description: string;
  styles?: Styles;
}>;

export const accordionItemMappings: ResolveComponentResultWithType = {
  type: 'accordionItem',
  component: AccordionItem,
  includeContext: true,
};

export default AccordionItem;
export * from './decorator';
