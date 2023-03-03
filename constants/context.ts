import { IAppContext } from "../types/context";

export const initialContext: IAppContext = {
  state: {
    home: {
      latLong: '',
      coffeeStores: [],
    }
  },
  dispatch: () => {}
}