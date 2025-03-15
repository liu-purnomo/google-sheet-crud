# Google Sheet CRUD Service

A simple TypeScript-based service for interacting with Google Sheets using the Google Sheets API. This package provides methods for creating, updating, retrieving, and deleting data in Google Sheets.

## Installation

```sh
npm install google-sheet-crud
```

## Setup

You need to provide Google API credentials (client_email and private_key). These credentials should be obtained from Google Cloud Platform.

## Usage

### Importing the Service

```ts
import { GoogleSheetService } from 'google-sheet-crud';

const credentials = {
  client_email: 'your-service-account@your-project.iam.gserviceaccount.com',
  private_key: 'your-private-key',
};

const sheetService = new GoogleSheetService(credentials);
```

### Create a New Row

```ts
await sheetService.create({
  sheetId: 'your-sheet-id',
  range: 'Sheet1!A2:E',
  data: {
    name: 'John Doe',
    email: 'john@example.com',
    age: 30,
    isActive: true,
    createdAt: new Date(),
  },
});
```

### Bulk Create Multiple Rows

```ts
await sheetService.bulkCreate({
  sheetId: 'your-sheet-id',
  range: 'Sheet1!A2:E',
  data: [
    { name: 'Alice', email: 'alice@example.com', age: 28, isActive: true, createdAt: new Date() },
    { name: 'Bob', email: 'bob@example.com', age: 35, isActive: false, createdAt: new Date() },
  ],
});
```

### Update a Row by ID

```ts
await sheetService.update({
  sheetId: 'your-sheet-id',
  range: 'Sheet1!A2:E',
  id: 5, // Row ID
  data: {
    name: 'Updated Name',
    email: 'updated@example.com',
    age: 32,
    isActive: false,
    createdAt: new Date(),
  },
});
```

### Retrieve Data

```ts
const data = await sheetService.get({
  sheetId: 'your-sheet-id',
  range: 'Sheet1!A2:E',
});
console.log(data);
```

### Delete a Row by ID

```ts
await sheetService.delete({
  sheetId: 'your-sheet-id',
  sheet: 'Sheet1',
  id: 5, // Row ID to delete
});
```

## License

This project is licensed under the MIT License.

## Author

[Liu Purnomo](https://github.com/liu-purnomo)

