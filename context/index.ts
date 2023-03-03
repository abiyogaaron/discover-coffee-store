import { createContext, useContext } from "react";
import { initialContext } from "../constants/context";
import { 
  EAppAction, 
  IAppAction, 
  IAppContext,
  IHomeContext, 
} from "../types/context";

export const Store = createContext<IAppContext>(initialContext);

export const Reducer = (state: IAppContext['state'], action: IAppAction): IAppContext['state'] => {
  switch (action.type) {
    case EAppAction.SET_LAT_LONG: {
      const latLong = action.payload as IHomeContext['latLong'];
      return {
        ...state,
        home: { ...state.home, latLong: latLong }
      };
    }
    case EAppAction.SET_COFFEE_STORES: {
      const coffeeStores = action.payload as IHomeContext['coffeeStores'];
      return {
        ...state,
        home: { ...state.home, coffeeStores: coffeeStores }
      };
    }
    default: {
      return state;
    }
  }
}

export const useAppContext = () => useContext(Store);