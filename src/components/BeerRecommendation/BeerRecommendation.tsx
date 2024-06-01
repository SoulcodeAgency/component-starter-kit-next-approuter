import { Suspense } from 'react';
import { headers } from 'next/headers';
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

const getLocationData = async (context: { searchParams: Record<string, string | undefined> | undefined }) => {
  const allHeaders = headers();
  let ip = context.searchParams?.['ip'] ?? allHeaders.get('x-forwarded-for');

  // localhost override
  if (ip === '::1') {
    ip = '8.8.4.4';
  }

  const lat = allHeaders.get('x-vercel-ip-latitude') ?? '37.7825';
  const long = allHeaders.get('x-vercel-ip-longitude') ?? '-122.435';
  const city = allHeaders.get('x-vercel-ip-city') ?? 'San Francisco';
  const region = allHeaders.get('x-vercel-ip-country-region') ?? 'California';
  console.log({ ip, lat, long, city, region });
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
  const { long, lat, city, region } = await getLocationData(context);
  const weatherResponse = await fetch(
    `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${long}&current=temperature_2m`
  );
  const weatherData = await weatherResponse.json();

  const current: number = weatherData?.current?.temperature_2m;
  return (
    <div className="pt-16 flex flex-col text-center items-center w-full">
      <h1 className="text-2xl md:text-5xl font-medium">
        It is currently {current?.toString()}°C in {decodeURI(city)}, {region}...
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
  const { lat, long } = await getLocationData(context);
  const weatherResponse = await fetch(
    `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${long}&current=temperature_2m`
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
