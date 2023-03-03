interface IAppParams {
  storeId: string;
}
export type TAppParams = Partial<IAppParams>;

export enum EGeoErrorCodes {
  PERMISSION_DENIED = 1,
  POSITION_UNAVAILABLE = 2,
  TIMEOUT = 3,
}

export interface ICoffeeStores {
  fsq_id: string;
  categories: {
    id: number;
    name: string;
    icon: {
      prefix: string;
      suffix: string;
    }
  }[],
  chains: any[],
  distance: number,
  geocodes: {
    main: {
      latitude: number;
      longitude: number;
    },
    roof: {
      latitude: number;
      longitude: number;
    }
  },
  link: string;
  location: {
    address: string;
    country: string;
    cross_street: string;
    formatted_address: string;
    locality: string;
    postcode: string;
    region: string;
  },
  name: string;
  related_places: object;
  timezone: string;
}
export interface IGetCoffeeStoreResponses {
  results: ICoffeeStores[],
  context: {
    geo_bounds: {
      circle: {
        center: {
          latitude: number;
          longitude: number;
        },
        radius: number;
      }
    }
  }
}

export interface ICoffeeStoresData {
  id: string;
  name: string;
  address: string;
  neighborhood: string;
  imgUrl: string;
}

export enum ErrorCodesService {
  GENERAL_ERROR = 'GENERAL_ERROR',
  NO_QUERY_PARAMS = 'NO_QUERY_PARAMS',
  WRONG_HTTP_METHOD = 'WRONG_HTTP_METHOD',
  MISSING_SOME_REQ_BODY = 'MISSING_SOME_REQ_BODY',
  RESOURCE_NOT_FOUND = 'RESOURCE_NOT_FOUND',
}
