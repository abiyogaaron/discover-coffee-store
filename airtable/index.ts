import Airtable, { FieldSet, Records } from "airtable";
import { TABLE_NAMES } from "../constants";

const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY })
  .base(process.env.AIRTABLE_BASE_KEY || '');

export const table = base(TABLE_NAMES.STORES);

export const getReformattedRecords = (records: Records<FieldSet>) => {
  return records.map((record) => {
    return { ...record.fields }
  })
}