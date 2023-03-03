import type { NextApiRequest, NextApiResponse } from 'next';
import { ERROR_OBJ_SERVICE } from '../../../constants';
import {
  getCoffeeStores,
} from '../../../services';
import { ErrorCodesService, ICoffeeStoresData } from '../../../types';

interface IGetResponse {
  message: string;
  err?: any;
  data?: ICoffeeStoresData[];
}

const index = async (req: NextApiRequest, res: NextApiResponse<IGetResponse>) => {
  try {
    const { latLong, limit } = req.query;
    console.log("request query: ", req.query);

    if (!latLong || !limit) {
      throw ErrorCodesService.NO_QUERY_PARAMS
    }
    if (req.method !== 'GET') {
      throw ErrorCodesService.WRONG_HTTP_METHOD
    }
    const response = await getCoffeeStores(latLong as string, 'coffee', parseInt(limit as string));

    console.log("response: ", response);
    res.status(200);
    res.json({
      data: response,
      message: 'success',
    });
  } catch (err: any) {
    console.error("error getting data -> ", err);
    
    let errors;
    if (ERROR_OBJ_SERVICE[err as ErrorCodesService]) {
      errors = ERROR_OBJ_SERVICE[err as ErrorCodesService];
    } else {
      errors = ERROR_OBJ_SERVICE[ErrorCodesService.GENERAL_ERROR];
    }

    res.status(errors.httpCode);
    res.json({
      message: errors.message,
      err,
    });
  }
}

export default index;