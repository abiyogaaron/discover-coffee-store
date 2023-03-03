import type { NextApiRequest, NextApiResponse } from 'next';
import { ErrorCodesService } from '../../../types';
import { ERROR_OBJ_SERVICE } from '../../../constants';

import { table, getReformattedRecords } from '../../../airtable';

const vote = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'PUT') {
    throw ErrorCodesService.WRONG_HTTP_METHOD;
  }

  const { 
    id, 
  } = req.body;

  try {
    const records = await table.select({
      filterByFormula: `id="${id}"`,
    }).firstPage();

    if (records.length === 0) {
      throw ErrorCodesService.RESOURCE_NOT_FOUND;
    }
    const record = records[0];

    const updatedVote = record.fields.voting as number;
    const updatedRecord = await table.update([
      {
        id: record.id,
        fields: {
          voting: updatedVote + 1,
        }
      }
    ]);
    const coffeeStores = getReformattedRecords(updatedRecord);

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

export default vote;