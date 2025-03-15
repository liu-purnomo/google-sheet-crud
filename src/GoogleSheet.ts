import { google } from 'googleapis';
import { getLatestId, sheetArrayToObject, validateRange } from './config';

export class GoogleSheet {
  private auth;
  private client: any;

  /**
   * Initializes GoogleSheet with given credentials.
   * @param credentials - Google API credentials (client_email, private_key)
   */
  constructor(credentials: { client_email: string; private_key: string }) {
    this.auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: credentials.client_email,
        private_key: credentials.private_key.replace(/\\n/g, '\n'),
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });
  }

  /**
   * Returns an authenticated Google Sheets API client instance.
   */
  private async getClient() {
    if (!this.client) {
      this.client = await this.auth.getClient();
    }
    return google.sheets({ version: 'v4', auth: this.client as any });
  }

  /**
   * Fetches data from the specified Google Sheet range and converts it to an array of objects.
   * @param spreadsheetId - The ID of the Google Spreadsheet.
   * @param range - The sheet range to retrieve data from (e.g., 'Sheet1!A:D').
   * @returns An array of objects representing the sheet data.
   */
  async get(spreadsheetId: string, range: string) {
    try {
      const googleSheets = await this.getClient();
      const { data } = await googleSheets.spreadsheets.values.get({
        spreadsheetId,
        range,
      });
      return sheetArrayToObject(data?.values || []);
    } catch (error) {
      throw new Error(`Failed to get data: ${error}`);
    }
  }

  /**
   * Updates a specific row in the Google Sheet.
   * @param spreadsheetId - The ID of the Google Spreadsheet.
   * @param sheet - The sheet name.
   * @param id - Row ID to update.
   * @param values - A 2D array of new values.
   */
  async update(
    spreadsheetId: string,
    sheet: string,
    id: number,

    values: any[][]
  ) {
    const googleSheets = await this.getClient();

    const { sheetName, rangeEnd } = validateRange(sheet);

    return await googleSheets.spreadsheets.values.update({
      spreadsheetId,
      range: `${sheetName}!B${id}:${rangeEnd}`,
      valueInputOption: 'USER_ENTERED',
      requestBody: { values },
    });
  }
  async updateWithId(spreadsheetId: string, range: string, values: any[][]) {
    const googleSheets = await this.getClient();
    return await googleSheets.spreadsheets.values.update({
      spreadsheetId,
      range,
      valueInputOption: 'USER_ENTERED',
      requestBody: { values },
    });
  }

  /**
   * Appends new data to the Google Sheet with an automatically incrementing ID.
   * @param spreadsheetId - The ID of the Google Spreadsheet.
   * @param range - The sheet range where data should be appended (e.g., 'Sheet1!A:D').
   * @param values - A 2D array containing the data to be added.
   */
  async create(spreadsheetId: string, range: string, values: any[][]) {
    const googleSheets = await this.getClient();
    const listData = await this.get(spreadsheetId, range);
    const latestId = await getLatestId(listData);

    const dataToAppend = values.map((row, index) => [
      latestId + index + 1,
      ...row,
    ]);

    return await googleSheets.spreadsheets.values.append({
      spreadsheetId,
      range,
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: dataToAppend,
      },
    });
  }

  /**
   * Deletes a row from the Google Sheet and reorders IDs.
   * @param spreadsheetId - The ID of the Google Spreadsheet.
   * @param sheet - The sheet name.
   * @param id - The row ID to delete.
   */
  async delete(spreadsheetId: string, sheet: string, id: number) {
    const listData = await this.get(spreadsheetId, sheet);

    const { sheetName, rangeEnd } = validateRange(sheet);
    if (!listData || listData.length === 0) {
      throw new Error('No data found in the specified range.');
    }

    // 1️⃣ Find the index of the data to be deleted
    const deletedIndex = listData.findIndex((item) => Number(item.id) === id);
    if (deletedIndex === -1) {
      throw new Error(`ID ${id} not found.`);
    }
    const firstRow = 2;
    // 3️⃣ Update the IDs of remaining rows
    const updatedListData = listData
      .filter((item) => Number(item.id) !== id)
      .map((item, index) => [
        index + firstRow, // Reorder ID
        ...Object.values(item).slice(1),
      ]);

    // 4️⃣ Ensure the update only happens if there is remaining data
    if (updatedListData.length > 0) {
      await this.updateWithId(
        spreadsheetId,
        `${sheetName}!A2`,
        updatedListData
      ); // Make sure it calls the correct function
    }

    // 5️⃣ remove last row
    await this.remove(
      spreadsheetId,
      `${sheetName}!A${listData.length + 1}:${rangeEnd}`
    );

    return updatedListData;
  }

  /**
   * Clears a specific range in the Google Sheet.
   * @param spreadsheetId - The ID of the Google Spreadsheet.
   * @param range - The range to clear (e.g., 'Sheet1!A2:D10').
   */
  async remove(spreadsheetId: string, range: string) {
    const googleSheets = await this.getClient();
    return await googleSheets.spreadsheets.values.clear({
      spreadsheetId,
      range,
    });
  }
}
