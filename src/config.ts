/**
 * Converts a 2D array from Google Sheets into an array of objects.
 * Each row is mapped to an object using the headers from the first row.
 *
 * @param array - The raw 2D array data from Google Sheets.
 * @param headerIndex - The index of the row that contains the headers (default is 0).
 * @returns An array of objects where keys are headers and values are row data.
 */
export const sheetArrayToObject = (array: any[], headerIndex = 0) => {
  // Validate that the input is a valid array
  if (!Array.isArray(array) || array.length === 0) {
    throw new Error('Input array is not valid');
  }

  // Extract the header row from the given index
  const headers = array[headerIndex];

  // Validate that the header row is an array and not empty
  if (!Array.isArray(headers) || headers.length === 0) {
    throw new Error('Header row is not valid');
  }

  // Initialize an empty array to store the resulting objects
  const result: { [key: string]: any }[] = [];

  // Loop through the rows, starting from the row after the header
  for (let i = headerIndex + 1; i < array.length; i++) {
    const row = array[i];

    // Ensure that the row is an array before processing
    if (Array.isArray(row)) {
      const obj: { [key: string]: any } = {};

      // Loop through each column in the row and assign values based on headers
      for (let j = 0; j < headers.length; j++) {
        obj[headers[j]] = row[j] !== undefined ? row[j] : null;
      }

      // Add the mapped object to the result array
      result.push(obj);
    }
  }

  return result; // Return the array of objects
};

/**
 * Fetches the latest (highest) ID from the Google Sheet.
 * The ID column is assumed to be a numerical value in the "id" field.
 *
 * @param spreadsheetId - The ID of the Google Spreadsheet.
 * @param sheetRange - The range of the sheet to fetch data from (e.g., 'Product!A:D').
 * @returns The highest numerical ID found in the sheet, or 1 if the sheet is empty.
 */
export const getLatestId = async (listData: any[]): Promise<number> => {
  // If no data is found, return 1 as the default starting ID
  if (!listData || listData.length === 0) return 1;

  // Find the maximum ID by iterating through the data
  return listData.reduce((max, item) => {
    const idValue = parseInt(item.id, 10); // Convert the ID string to a number
    return isNaN(idValue) ? max : Math.max(max, idValue); // Compare and keep the highest value
  }, 0);
};

/**
 * Validates a Google Sheets range format (e.g., "Sheet1!A1:D10").
 * @param {string} range - The range string to validate.
 * @throws {Error} If the format is invalid.
 * @returns {{ sheetName: string, startCell: string, endCell: string, rangeEnd: string }} - Parsed range details.
 */
export const validateRange = (range: string) => {
  if (!range.includes('!')) {
    throw new Error('Range invalid: Missing "!" separator.');
  }

  const [sheetName, sheetRange] = range.split('!');

  if (!sheetRange.includes(':')) {
    throw new Error('Range invalid: Missing ":" separator.');
  }

  const [startCell, endCell] = sheetRange.split(':');

  const rangeEnd = endCell.match(/[A-Z]+/g)?.[0] || '';

  return { sheetName, startCell, endCell, rangeEnd };
};
