import { GoogleSheet } from './GoogleSheet';

interface CreateProps {
  sheetId: string;
  range: string;
  data: Record<string, string | number | boolean | Date>;
}

interface UpdateProps extends CreateProps {
  id: number;
}

interface RemoveProps {
  sheetId: string;
  sheet: string;
  id: number;
}

interface GetProps {
  sheetId: string;
  range: string;
}

interface bulkCreateProps {
  sheetId: string;
  range: string;
  data: Record<string, string | number | boolean | Date>[];
}

export class GoogleSheetService {
  private sheetInstance: GoogleSheet;

  /**
   * Constructor for GoogleSheetService, initializes with credentials.
   * @param credentials - Google API credentials (client_email, private_key).
   */
  constructor(credentials: { client_email: string; private_key: string }) {
    this.sheetInstance = new GoogleSheet(credentials);
  }

  /**
   * Adds new data to Google Sheets.
   * @param {CreateProps} params - Parameters for creating new data.
   * @returns {Promise<any>} - Response from Google Sheets API.
   * @throws {Error} - If data is empty.
   */
  async create({ sheetId, range, data }: CreateProps) {
    if (!data || Object.keys(data).length === 0) {
      throw new Error('Data cannot be empty.');
    }

    const values = [Object.values(data)];
    return await this.sheetInstance.create(sheetId, range, values);
  }

  /**
   * Adds multiple rows of data to Google Sheets.
   * @param {CreateProps[]} entries - Array of parameters for creating new data.
   * @returns {Promise<any>} - Response from Google Sheets API.
   * @throws {Error} - If entries array is empty.
   */
  async bulkCreate({ data, range, sheetId }: bulkCreateProps) {
    if (!data || data.length === 0) {
      throw new Error('Entries cannot be empty.');
    }

    const values = data.map((entry) => Object.values(entry));

    return await this.sheetInstance.create(sheetId, range, values);
  }

  /**
   * Updates existing data in Google Sheets based on ID.
   * @param {UpdateProps} params - Parameters for updating data.
   * @returns {Promise<any>} - Response from Google Sheets API.
   * @throws {Error} - If data is empty.
   */
  async update({ sheetId, range, id, data }: UpdateProps) {
    if (!data || Object.keys(data).length === 0) {
      throw new Error('Data cannot be empty.');
    }

    const values = [Object.values(data)];
    return await this.sheetInstance.update(sheetId, range, id, values);
  }

  /**
   * Retrieves data from Google Sheets.
   * @param {GetProps} params - Parameters for retrieving data.
   * @returns {Promise<any>} - Data from Google Sheets.
   */
  async get({ sheetId, range }: GetProps) {
    return await this.sheetInstance.get(sheetId, range);
  }

  /**
   * Deletes a specific row from Google Sheets based on ID.
   * @param {RemoveProps} params - Parameters for deleting data.
   * @returns {Promise<any>} - Response from Google Sheets API.
   */
  async delete({ sheetId, sheet, id }: RemoveProps) {
    return await this.sheetInstance.delete(sheetId, sheet, id);
  }
}
