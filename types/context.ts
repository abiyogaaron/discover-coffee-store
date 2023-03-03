import { Dispatch } from "react";
import { ICoffeeStoresData } from ".";

export interface IHomeContext {
  latLong: string;
  coffeeStores: ICoffeeStoresData[]
}

export enum EAppAction {
  SET_LAT_LONG = 'SET_LAT_LONG',
  SET_COFFEE_STORES = 'SET_COFFEE_STORES',
}

export interface IAppAction {
  type: EAppAction,
  payload: 
    | IHomeContext['latLong']
    | IHomeContext['coffeeStores']
}

export interface IAppContext {
  state: {
    home: IHomeContext;
  },
  dispatch: Dispatch<any>;
}