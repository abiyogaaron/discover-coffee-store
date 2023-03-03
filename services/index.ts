import { createApi } from 'unsplash-js';

import { END_POINTS } from "../constants";
import { ICoffeeStoresData, IGetCoffeeStoreResponses } from '../types';

const getStorePhotos = async (query: string) => {
  try {
    const unsplash = createApi({
      accessKey: process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY || '',
    });

    const photos = await unsplash.search.getPhotos({
      query,
      perPage: 30,
    });
    
    if (photos && photos.response) {
      return photos.response.results.map((photo) => photo.urls.regular);
    }
    return [];
  } catch (err) {
    console.error(`error unsplash: `, err);
    return [];
  }
}

export const getCoffeeStores = async (latLong: string, query: string, limit: number): Promise<ICoffeeStoresData[]> => {
  try {
    const photos = await getStorePhotos('coffee store');
    const reqHeaders: HeadersInit = new Headers();
    reqHeaders.set('Accept', 'application/json');
    reqHeaders.set('Authorization', process.env.NEXT_PUBLIC_FOURSQUARE_API_KEY || '');
  
    const url = END_POINTS.PLACE_SEARCH
      .replace('{query}', query)
      .replace('{latLong}', latLong)
      .replace('{limit}', limit.toString())
    const response = await fetch(url, {
      method: 'GET',
      headers: reqHeaders,
    });
  
    const data = await response.json() as IGetCoffeeStoreResponses;
    return data.results.map((store, idx) => {
      return {
        id: store.fsq_id,
        name: store.name,
        address: store.location.address,
        neighborhood: store.location.locality,
        imgUrl: photos[idx],
      }
    });
  } catch (err) {
    console.error(`error http call: `, err);
    return [];
  }
}

interface ICoffeStoreAirTable extends ICoffeeStoresData {
  voting: number;
}
export const createCoffeeStore = async (data: ICoffeStoreAirTable) => {
  try {
    const reqHeaders: HeadersInit = new Headers();
    reqHeaders.set('Content-type', 'application/json');

    const response = await fetch(END_POINTS.CREATE_STORE, {
      method: 'POST',
      headers: reqHeaders,
      body: JSON.stringify(data)
    });

    return await response.json();
  } catch (err) {
    console.error(`error http call: `, err);
    return null;
  }
}

export const voteCoffeeStore = async (id: string) => {
  try {
    const reqHeaders: HeadersInit = new Headers();
    reqHeaders.set('Content-type', 'application/json');

    const response = await fetch(END_POINTS.VOTE, {
      method: 'PUT',
      headers: reqHeaders,
      body: JSON.stringify({ id })
    });

    const coffeeStore = await response.json();
    if (coffeeStore && coffeeStore.length > 0) {
      return coffeeStore;
    }
  } catch (err) {
    console.error(`error http call: `, err);
    return null;
  }
}