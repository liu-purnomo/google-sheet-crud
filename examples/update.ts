import dotenv from 'dotenv';
import { GoogleSheetService } from '../src';

dotenv.config();

const credentials = {
  client_email: process.env.GOOGLE_CLIENT_EMAIL || '',
  private_key: (process.env.GOOGLE_PRIVATE_KEY || '').replace(/\\n/g, '\n'),
};

const sheetService = new GoogleSheetService(credentials);

const sheetId = process.env.GOOGLE_SPREADSHEET_ID || '';
const range = 'Product!A1:F';

const newData = {
  name: 'Sudah Benar',
  email: 'alice@example.com',
  age: 28,
  registered: true,
  createdAt: new Date(),
};

(async () => {
  try {
    const response = await sheetService.update({
      sheetId,
      range,
      data: newData,
      id: 5,
    });
    console.log(response);
  } catch (error) {
    console.error(error);
  }
})();
