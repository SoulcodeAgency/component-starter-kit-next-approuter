import { Suspense } from 'react';
import { ContextUpdateTransfer } from '@uniformdev/canvas-next-rsc';
import { ComponentProps, ResolveComponentResult, UniformSlot } from '@uniformdev/canvas-next-rsc/component';

import { AppDirectoryServerContext } from '@uniformdev/canvas-next-rsc-shared';
import { SkeletonHero } from '@/canvas/Hero/SkeletonHero';

export type Parameters = {
  contextInstance: AppDirectoryServerContext;
  title: string;
  description: string;
};

export type Slots = 'recommendations';

const getLocationData = (context: { searchParams: Record<string, string | undefined> | undefined }) => {
  const lat = context.searchParams?.['lat'] ?? '37.7825';
  const long = context.searchParams?.['long'] ?? '-122.435';
  const city = context.searchParams?.['city'] ?? 'San Francisco';
  const region = context.searchParams?.['region'] ?? 'California';
  return { city, region, lat, long };
};

export const BeerRecommendation = async ({
  component,
  context,
  contextInstance,
  slots,
}: ComponentProps<Parameters, Slots>) => {
  const placeholder = (
    <div className="pt-16 flex flex-col text-center items-center w-full">
      <h1 className="text-2xl md:text-5xl font-medium">We are loading your weather data here...</h1>
    </div>
  );
  return (
    <>
      <div>
        <Suspense fallback={placeholder}>
          <CurrentTemperature context={context} />
        </Suspense>
      </div>
      <div>
        <Suspense fallback={<SkeletonHero />}>
          <DrinkSuggestion component={component} context={context} contextInstance={contextInstance} slots={slots} />
        </Suspense>
      </div>
    </>
  );
};

const CurrentTemperature = async ({ context }: Pick<ComponentProps<Parameters, Slots>, 'context'>) => {
  const { long, lat, city } = getLocationData(context);
  const weatherResponse = await fetch(
    `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${long}&current=temperature_2m`,
    {
      next: {
        revalidate: 60,
      },
    }
  );
  const weatherData = await weatherResponse.json();

  const current: number = weatherData?.current?.temperature_2m;
  return (
    <div className="pt-16 flex flex-col text-center items-center w-full">
      <h1 className="text-2xl md:text-5xl font-medium">
        It is currently {current?.toString()}°C in {decodeURI(city)}...
      </h1>
    </div>
  );
};

const SUGGESTION_PREFIX = 'ctx';

const DrinkSuggestion = async ({
  context,
  component,
  slots,
  contextInstance,
}: Pick<ComponentProps<Parameters, Slots>, 'context' | 'component' | 'slots' | 'contextInstance'>) => {
  const { lat, long } = getLocationData(context);
  const weatherResponse = await fetch(
    `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${long}&current=temperature_2m`,
    {
      next: {
        revalidate: 60,
      },
    }
  );

  const weatherData = await weatherResponse.json();
  const current: number = weatherData?.current?.temperature_2m;
  const roundedDown = Math.floor(current);

  let updateEnrichments: {
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

  const existing = Object.keys(contextInstance.scores).filter(key => key.startsWith(SUGGESTION_PREFIX));

  // skipping enrichments if those are already present
  if (existing.length) {
    updateEnrichments = [];
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

export type ResolveComponentResultWithType = ResolveComponentResult & {
  type: string;
};

export const beerRecommendationMapping = {
  beerRecommendation: BeerRecommendation,
};
