import type { NextApiRequest, NextApiResponse } from 'next';
import { ErrorCodesService } from '../../../types';
import { ERROR_OBJ_SERVICE } from '../../../constants';

import { table, getReformattedRecords } from '../../../airtable';

const create = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    throw ErrorCodesService.WRONG_HTTP_METHOD;
  }

  const { 
    id, 
    name, 
    neighborhood, 
    address, 
    imgUrl, 
    voting,
  } = req.body;

  try {
    if (id) {
      const records = await table.select({
        filterByFormula: `id="${id}"`,
      }).firstPage();
      
      if (records.length > 0) {
        const coffeeStores = getReformattedRecords(records);
        res.status(200);
        res.json(coffeeStores);
        return;
      }
    }

    if (!name || !id) {
      throw ErrorCodesService.MISSING_SOME_REQ_BODY;
    }
    const createdRecords = await table.create([
      {
        fields: {
          id,
          name,
          address,
          neighborhood,
          imgUrl,
          voting,
        }
      }
    ]);

    const createdCoffeeStores = getReformattedRecords(createdRecords);
    res.status(201);
    res.json(createdCoffeeStores);
    return;
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

export default create;