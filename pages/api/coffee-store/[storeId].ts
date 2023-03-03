import type { NextApiRequest, NextApiResponse } from 'next';
import { ErrorCodesService } from '../../../types';
import { ERROR_OBJ_SERVICE } from '../../../constants';

import { table, getReformattedRecords } from '../../../airtable';

const getById = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { storeId } = req.query;
    if (!storeId) {
      throw ErrorCodesService.NO_QUERY_PARAMS;
    }
    if (req.method !== 'GET') {
      throw ErrorCodesService.WRONG_HTTP_METHOD;
    }

    const records = await table.select({
      filterByFormula: `id="${storeId}"`,
    }).firstPage();

    if (records.length === 0) {
      res.status(200);
      res.json([]);
      return;
    }

    const coffeeStores = getReformattedRecords(records);
    res.status(200);
    res.json(coffeeStores);
  } catch (err) {
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

export default getById;