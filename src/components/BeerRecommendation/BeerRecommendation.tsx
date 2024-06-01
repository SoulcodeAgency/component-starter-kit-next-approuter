import { Suspense } from 'react';
import { headers } from 'next/headers';
import { ContextUpdateTransfer } from '@uniformdev/canvas-next-rsc';
import { ComponentProps, UniformSlot } from '@uniformdev/canvas-next-rsc/component';

import { AppDirectoryServerContext } from '@uniformdev/canvas-next-rsc-shared';
import { SkeletonHero } from '@/canvas/Hero/SkeletonHero';

export type Parameters = {
  contextInstance: AppDirectoryServerContext;
  title: string;
  description: string;
};

export type Slots = 'recommendations';

const getLocationData = async (context: { searchParams: Record<string, string | undefined> | undefined }) => {
  const allHeaders = headers();

  let ip = context.searchParams?.['ip'] ?? allHeaders.get('x-forwarded-for');

  if (ip === '::1') {
    ip = '8.8.4.4';
  }

  const response = await fetch(`https://ipinfo.io/${ip}?token=58d3b46d7f9303`);

  const data = (await response.json()) as {
    city: string;
    region: string;
    loc: string;
  };

  console.log({ data });

  return data;
};

export const BeerRecommendation = async ({
  component,
  context,
  contextInstance,
  slots,
}: ComponentProps<Parameters, Slots>) => {
  return (
    <>
      {/* <h1>
        Hello <LocationTextWrapper context={context} type="city" />,{' '}
        <LocationTextWrapper context={context} type="region" />!
      </h1> */}
      <div>
        Its <CurrentTemperatureWrapper context={context} />
        °F currently where you are.
      </div>
      <div>
        {' '}
        <DrinkSuggestionWrapper
          component={component}
          context={context}
          contextInstance={contextInstance}
          slots={slots}
        />
      </div>
    </>
  );
};

// const LocationTextWrapper = ({
//   context,
//   type,
// }: Pick<ComponentProps<Parameters, Slots>, 'context'> & {
//   type: 'region' | 'city';
// }) => {
//   return (
//     <Suspense fallback={null}>
//       <LocationText context={context} type={type} />
//     </Suspense>
//   );
// };

// const LocationText = async ({
//   context,
//   type,
// }: Pick<ComponentProps<Parameters, Slots>, 'context'> & {
//   type: 'region' | 'city';
// }) => {
//   const data = await getLocationData(context);
//   const text = data[type];
//   return text;
// };

const CurrentTemperatureWrapper = ({ context }: Pick<ComponentProps<Parameters, Slots>, 'context'>) => {
  return (
    <Suspense fallback={'00.0'}>
      <CurrentTemperature context={context} />
    </Suspense>
  );
};

const CurrentTemperature = async ({ context }: Pick<ComponentProps<Parameters, Slots>, 'context'>) => {
  const data = await getLocationData(context);
  const [lat, long] = data.loc.split(',');
  const weatherResponse = await fetch(
    `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${long}&current=temperature_2m&temperature_unit=fahrenheit`
  );
  const weatherData = await weatherResponse.json();
  const current: number = weatherData.current.temperature_2m;
  return current.toString();
};

const DrinkSuggestionWrapper = ({
  context,
  component,
  slots,
  contextInstance,
}: Pick<ComponentProps<Parameters, Slots>, 'context' | 'component' | 'slots' | 'contextInstance'>) => {
  return (
    <Suspense fallback={<SkeletonHero />}>
      <DrinkSuggestion component={component} context={context} contextInstance={contextInstance} slots={slots} />
    </Suspense>
  );
};

const SUGGESTION_PREFIX = 'ctx';

const DrinkSuggestion = async ({
  context,
  component,
  slots,
  contextInstance,
}: Pick<ComponentProps<Parameters, Slots>, 'context' | 'component' | 'slots' | 'contextInstance'>) => {
  const data = await getLocationData(context);

  const [lat, long] = data.loc.split(',');

  const weatherResponse = await fetch(
    `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${long}&current=temperature_2m&temperature_unit=fahrenheit`
  );

  const weatherData = await weatherResponse.json();

  const current: number = weatherData.current.temperature_2m;
  const roundedDown = Math.floor(current);

  const updateEnrichments: {
    cat: string;
    key: string;
    str: number;
  }[] = [
    {
      cat: SUGGESTION_PREFIX,
      key: 'temp',
      str: roundedDown,
    },
  ];

  console.log({ contextInstance, updateEnrichments });
  const existing = contextInstance
    ? Object.keys(contextInstance?.scores).filter(key => key.startsWith(SUGGESTION_PREFIX))
    : [];

  if (existing.length) {
    existing.forEach(existingItem => {
      const [cat, key] = existingItem.split('_');

      if (key !== updateEnrichments[0].key) {
        updateEnrichments.push({
          cat,
          key,
          str: -contextInstance?.scores[existingItem],
        });
      }
    });
  }

  return (
    <>
      <ContextUpdateTransfer
        serverContext={contextInstance}
        update={{
          enrichments: updateEnrichments,
        }}
      />
      <UniformSlot context={context} data={component} slot={slots.recommendations} />
    </>
  );
};
