import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// This function can be marked `async` if using `await` inside
export default function middleware(request: NextRequest) {
  if (!process.env.VERCEL_URL) {
    console.log('VERCEL_URL is not set. existing');
    return NextResponse.next();
  }

  const lat = request.geo?.latitude;
  const long = request.geo?.longitude;
  const city = request.geo?.city;
  const region = request.geo?.region;
  const url = new URL(request.url);
  const params = new URLSearchParams(url.search);

  // short circuiting if the lat is already present
  if (url.searchParams.get('lat')) {
    console.log('lat already present. exiting');
    return NextResponse.next();
  }

  if (lat) {
    params.set('lat', lat);
  }

  if (long) {
    params.set('long', long);
  }

  if (city) {
    params.set('city', city);
  }

  if (region) {
    params.set('region', region);
  }

  const newUrl = `https://${process.env.VERCEL_URL}/${url.pathname}?${params.toString()}`;
  console.log({ newUrl, url: request.url.toString(), lat, long, city, region });

  return NextResponse.rewrite(newUrl);
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: '/',
};
