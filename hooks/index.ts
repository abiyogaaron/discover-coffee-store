import { useState } from "react"
import { useAppContext } from "../context";
import { EGeoErrorCodes } from "../types";
import { EAppAction } from "../types/context";

interface IGeoError {
  title: string;
  desc: string;
  isError: boolean;
} 

export const useGeoLocation = () => {
  const { dispatch } = useAppContext();

  const [geoError, setGeoError] = useState<IGeoError>({ title: '', desc: '', isError: false });
  const [isFinding, setIsFinding] = useState<boolean>(false);

  const trackLocation = () => {
    setIsFinding(true);
    if (!window.navigator.geolocation) {
      setGeoError({
        title: 'Location is not available',
        desc: 'Geo location is not supported by your browser',
        isError: true,
      });
    }

    window.navigator.geolocation.getCurrentPosition((pos) => {
      dispatch({
        type: EAppAction.SET_LAT_LONG,
        payload: `${pos.coords.latitude},${pos.coords.longitude}`,
      });
      
      setGeoError({ title: '', desc: '', isError: false });
      setIsFinding(false);
    }, (error) => {
      if (error.code === EGeoErrorCodes.PERMISSION_DENIED) {
        setGeoError({
          title: 'Permission Denied',
          desc: 'Please activate your location settings to get the current weather.',
          isError: true,
        });
      } else if (error.code === EGeoErrorCodes.POSITION_UNAVAILABLE) {
        setGeoError({
          title: 'Position Unavailable',
          desc: 'Please try to toggle the location settings.',
          isError: true,
        });
      } else if (error.code === EGeoErrorCodes.TIMEOUT) {
        setGeoError({
          title: 'Timeout Expired',
          desc: 'Please try again to get the location data.',
          isError: true,
        });
      }
      setIsFinding(false);
    });
  };

  return {
    trackLocation,
    geoError,
    isFinding,
  }
}