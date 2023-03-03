import { ErrorCodesService } from "../types";

export const DEFAULT_LAT_LONG = '-6.200000,106.816666';

export const FOURSQUARE_BASE = 'https://api.foursquare.com/v3';
export const END_POINTS = {
  PLACE_SEARCH: `${FOURSQUARE_BASE}/places/search?query={query}&ll={latLong}&limit={limit}&radius={radius}`,
  CREATE_STORE: '/api/coffee-store/create',
  VOTE: '/api/coffee-store/vote',
};

export const TABLE_NAMES = {
  STORES: 'stores',
};

export const ERROR_OBJ_SERVICE: Record<ErrorCodesService, { message: string, httpCode: number }> = {
  [ErrorCodesService.GENERAL_ERROR]: {
    message: 'There are something wrong with the server',
    httpCode: 500,
  },
  [ErrorCodesService.NO_QUERY_PARAMS]: {
    message: 'There is no query param !',
    httpCode: 400,
  },
  [ErrorCodesService.WRONG_HTTP_METHOD]: {
    message: 'Wrong http method !',
    httpCode: 400,
  },
  [ErrorCodesService.MISSING_SOME_REQ_BODY]: {
    message: 'Some request body are missing',
    httpCode: 400,
  },
  [ErrorCodesService.RESOURCE_NOT_FOUND]: {
    message: 'Resource not found',
    httpCode: 404,
  }
}