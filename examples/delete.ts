import dotenv from 'dotenv';
import { GoogleSheetService } from '../src';

dotenv.config();

const credentials = {
  client_email: process.env.GOOGLE_CLIENT_EMAIL || '',
  private_key: (process.env.GOOGLE_PRIVATE_KEY || '').replace(/\\n/g, '\n'),
};

const sheetService = new GoogleSheetService(credentials);

const sheetId = process.env.GOOGLE_SPREADSHEET_ID || '';
const sheet = 'Product!A1:F';
const id = 3;

(async () => {
  try {
    const response = await sheetService.delete({ sheetId, sheet, id });
    console.log('Delete Response:', response);
  } catch (error) {
    console.error('Error:', error);
  }
})();
