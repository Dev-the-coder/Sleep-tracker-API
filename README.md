# Sleep Tracker API

This API allows users to track their sleep duration by submitting records with timestamps, retrieving all sleep records for a specific user, and deleting specific sleep records. The API uses SQLite for data storage.

## Table of Contents

- [Setup](#setup)
- [Running the API](#running-the-api)
- [API Endpoints](#api-endpoints)
  - [POST /sleep](#post-sleep)
  - [GET /sleep/:userId](#get-sleepuserid)
  - [DELETE /sleep/:recordId](#delete-sleeprecordid)
- [Testing](#testing)

## Setup

1. **Clone the repository**:

   ```sh
   git clone https://github.com/Dev-the-coder/Sleep-tracker-api.git
   cd sleep-tracker-api
   ```

2. **Install dependencies**:

   ```sh
   npm install
   ```

3. **Ensure the database directory exists**:
   ```sh
   mkdir -p ./tmp
   ```

## Running the API

1. **Start the server**:

   ```sh
   npm start
   ```

   The server will start on port 8000 by default.

2. **To run the server in development mode with hot-reloading**:
   ```sh
   npm run dev
   ```

## API Endpoints

### POST `/sleep`

**Description**: Allows users to submit their sleep duration along with a timestamp.

**Request Body**:

- `userId` (string): The ID of the user.
- `hours` (real number): The number of hours slept.
- `timestamp` (string): The timestamp of the sleep record.

**Example**:

```json
{
  "userId": "user1",
  "hours": 8,
  "timestamp": "2023-01-01T00:00:00Z"
}
```

**Response**:

`201 Created`:

```json
{
  "message": "Sleep record added successfully."
}
```

`400 Bad Request`:

```json
{
  "error": "Missing required fields: userId, hours, and timestamp."
}
```

### GET `/sleep/:userId`

**Description**: Retrieves a list of all sleep records for a given user, sorted by date.

**Parameters**:

- `userId` (string): The ID of the user.

**Response**:

`200 OK`:

```json
{
  "message": "Sleep records retrieved successfully.",
  "records": [
    {
      "id": 1,
      "userId": "user1",
      "hours": 8,
      "timestamp": "2023-01-01T00:00:00Z"
    },
    {
      "id": 2,
      "userId": "user1",
      "hours": 7.5,
      "timestamp": "2023-01-02T00:00:00Z"
    }
  ]
}
```

`404 Not found`:

```json
{
  "error": "Missing required fields: userId, hours, and timestamp."
}
```

### DELETE `/sleep/:recordId`

**Description**: Deletes a specific sleep record by its ID.

**Parameters**:

- `recordId` (number): The ID of the sleep record.


**Response**:

`200 OK`:

```json
{
  "message": "Sleep record deleted successfully.",
  "deletedRecordId": "1"
}
```

`404 Not found`:

```json
{
  "error": "Sleep record not found."
}
```

### API not found Error

`404 Not found`:

```json
{
  "error": "Api not found !"
}
```

### All other errors

`500 Internal Server Error`:

```json
{
  "error": "Something went wrong"
}
```

## Testing

- The API can be tested using Jest.

1. **Run tests**:

   ```sh
   npm test
   ```

- The tests are located in the tests/sleep.test.js file and cover adding, retrieving, and deleting sleep records.
