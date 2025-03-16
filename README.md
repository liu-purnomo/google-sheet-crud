# GoogleSheetService Documentation

## Overview

The `GoogleSheetService` class provides an abstraction for interacting with Google Sheets. It allows users to perform CRUD operations (Create, Read, Update, Delete) efficiently.

## Prerequisites

Before using this service, ensure you have the following:

1. **Google IAM Service Account**: You must create a Google IAM service account and obtain its credentials (`client_email` and `private_key`).
2. **Google Sheets Setup**:
   - The first row of your Google Sheet must contain headers.
   - Column `A` should be named `id`.
   - The range should start from `A1`.

## Installation

To use this package, install it via NPM:

```sh
npm install google-sheet-crud
```

## Class: GoogleSheetService

### Constructor

```ts
constructor(credentials: { client_email: string; private_key: string })
```

- Initializes the `GoogleSheetService` instance with Google API credentials.

## Methods

### 1. `create`

```ts
async create({ sheetId, range, data }: CreateProps): Promise<any>
```

**Parameters:**
- `sheetId`: The ID of the Google Sheet.
- `range`: The range where data will be added (e.g., `Sheet1!A1:D1`).
- `data`: An object containing key-value pairs of data.

**Usage Example:**

```ts
import { GoogleSheetService } from 'google-sheet-crud';

const googleSheetService = new GoogleSheetService({
  client_email: 'your-service-account-email',
  private_key: 'your-private-key'
});

await googleSheetService.create({
  sheetId: 'your-sheet-id',
  range: 'Sheet1!A1:D1',
  data: { id: 1, name: 'John Doe', age: 30, active: true }
});
```

### 2. `bulkCreate`

```ts
async bulkCreate({ sheetId, range, data }: bulkCreateProps): Promise<any>
```

**Parameters:**
- `sheetId`: The ID of the Google Sheet.
- `range`: The range where data will be added.
- `data`: An array of objects containing key-value pairs.

**Usage Example:**

```ts
await googleSheetService.bulkCreate({
  sheetId: 'your-sheet-id',
  range: 'Sheet1!A1:D1',
  data: [
    { id: 1, name: 'John Doe', age: 30, active: true },
    { id: 2, name: 'Jane Doe', age: 25, active: false }
  ]
});
```

### 3. `update`

```ts
async update({ sheetId, range, id, data }: UpdateProps): Promise<any>
```

**Parameters:**
- `sheetId`: The ID of the Google Sheet.
- `range`: The range where data exists.
- `id`: The ID of the row to update.
- `data`: An object containing the updated key-value pairs.

**Usage Example:**

```ts
await googleSheetService.update({
  sheetId: 'your-sheet-id',
  range: 'Sheet1!A1:D1',
  id: 1,
  data: { name: 'John Updated', age: 31 }
});
```

### 4. `get`

```ts
async get({ sheetId, range }: GetProps): Promise<any>
```

**Parameters:**
- `sheetId`: The ID of the Google Sheet.
- `range`: The range to retrieve data from.

**Usage Example:**

```ts
const data = await googleSheetService.get({
  sheetId: 'your-sheet-id',
  range: 'Sheet1!A1:D10'
});
console.log(data);
```

### 5. `delete`

```ts
async delete({ sheetId, range, id }: RemoveProps): Promise<any>
```

**Parameters:**
- `sheetId`: The ID of the Google Sheet.
- `range`: The range where data exists.
- `id`: The ID of the row to delete.

**Usage Example:**

```ts
await googleSheetService.delete({
  sheetId: 'your-sheet-id',
  range: 'Sheet1!A1:D1',
  id: 1
});
```

## Additional Information

- Repository: [GitHub](https://github.com/liu-purnomo/google-sheet-crud)
- Full documentation: [Google Sheet CRUD Guide](https://liupurnomo.com/showcase/google-sheet-crud)
- Use case example: [Simple Todo List](https://liupurnomo.com/showcase/simple-todo-list)

