# String Analyzer Service

A RESTful API service that analyzes strings and stores their computed properties. This service provides endpoints for creating, retrieving, filtering, and deleting analyzed strings with comprehensive string analysis capabilities.

## Features

- **String Analysis**: Computes length, palindrome check, unique characters, word count, SHA-256 hash, and character frequency map
- **Data Persistence**: In-memory storage with SHA-256 hash-based uniqueness
- **Query Filtering**: Filter strings by various properties (palindrome status, length, word count, character presence)
- **Natural Language Queries**: Parse human-readable queries into filters
- **Full CRUD Operations**: Create, read, filter, and delete strings
- **Error Handling**: Comprehensive validation and error responses
- **CORS Enabled**: Cross-origin resource sharing support
- **JSON Responses**: Consistent API response format

## Setup Instructions

### Prerequisites

- Node.js (version 14 or higher)
- npm

### Installation

1. Clone or navigate to the project directory

2. Install dependencies:
   ```bash
   npm install
   ```

### Environment Variables

Create a `.env` file in the root directory (optional, for custom port):
```
PORT=3000
CAT_FACT_API_URL=https://catfact.ninja/fact
```

### Running the Application

Start the development server:
```bash
npm run dev
```

Or start the production server:
```bash
npm start
```

Or run directly with Node.js:
```bash
node index.js
```

The server will start on port 3000 (or the port specified in `.env`).

## API Endpoints

### 1. POST /strings - Create/Analyze String

Creates and analyzes a new string, computing all required properties.

**Request Body:**
```json
{
  "value": "string to analyze"
}
```

**Success Response (201 Created):**
```json
{
  "id": "sha256_hash_value",
  "value": "string to analyze",
  "properties": {
    "length": 17,
    "is_palindrome": false,
    "unique_characters": 12,
    "word_count": 3,
    "sha256_hash": "abc123...",
    "character_frequency_map": {
      "s": 2,
      "t": 3,
      "r": 2
    }
  },
  "created_at": "2025-08-27T10:00:00Z"
}
```

**Error Responses:**
- `409 Conflict`: String already exists
- `400 Bad Request`: Invalid request body or missing "value" field
- `422 Unprocessable Entity`: Invalid data type for "value"

**Example Request:**
```bash
curl -X POST http://localhost:3000/strings \
  -H "Content-Type: application/json" \
  -d '{"value": "hello world"}'
```

### 2. GET /strings/{string_value} - Get Specific String

Retrieves a previously analyzed string by its value.

**Success Response (200 OK):**
```json
{
  "id": "sha256_hash_value",
  "value": "requested string",
  "properties": { /* same as above */ },
  "created_at": "2025-08-27T10:00:00Z"
}
```

**Error Response:**
- `404 Not Found`: String does not exist

**Example Request:**
```bash
curl http://localhost:3000/strings/hello%20world
```

### 3. GET /strings - Get All Strings with Filtering

Retrieves all strings with optional filtering by properties.

**Query Parameters:**
- `is_palindrome`: boolean (true/false)
- `min_length`: integer (minimum string length)
- `max_length`: integer (maximum string length)
- `word_count`: integer (exact word count)
- `contains_character`: string (single character to search for)

**Success Response (200 OK):**
```json
{
  "data": [
    {
      "id": "hash1",
      "value": "string1",
      "properties": { /* ... */ },
      "created_at": "2025-08-27T10:00:00Z"
    }
  ],
  "count": 15,
  "filters_applied": {
    "is_palindrome": true,
    "min_length": 5
  }
}
```

**Error Response:**
- `400 Bad Request`: Invalid query parameter values or types

**Example Request:**
```bash
curl "http://localhost:3000/strings?is_palindrome=true&min_length=5"
```

### 4. GET /strings/filter-by-natural-language - Natural Language Filtering

Parses natural language queries into filters.

**Query Parameter:**
- `query`: string (natural language description)

**Success Response (200 OK):**
```json
{
  "data": [ /* array of matching strings */ ],
  "count": 3,
  "interpreted_query": {
    "original": "all single word palindromic strings",
    "parsed_filters": {
      "word_count": 1,
      "is_palindrome": true
    }
  }
}
```

**Example Queries:**
- "all single word palindromic strings" → word_count=1, is_palindrome=true
- "strings longer than 10 characters" → min_length=11
- "strings containing the letter z" → contains_character=z

**Error Responses:**
- `400 Bad Request`: Unable to parse natural language query
- `422 Unprocessable Entity`: Query parsed but resulted in conflicting filters

**Example Request:**
```bash
curl "http://localhost:3000/strings/filter-by-natural-language?query=all%20single%20word%20palindromic%20strings"
```

### 5. DELETE /strings/{string_value} - Delete String

Deletes a string from the system.

**Success Response (204 No Content):** Empty response body

**Error Response:**
- `404 Not Found`: String does not exist

**Example Request:**
```bash
curl -X DELETE http://localhost:3000/strings/hello%20world
```

### Legacy Endpoint

#### GET /me

Returns profile information and a random cat fact (preserved from original implementation).

**Response Format:**
```json
{
  "status": "success",
  "user": {
    "email": "marvellousabiola08@gmail.com",
    "name": "Ogunleke Marvellous",
    "stack": "Nodejs/express"
  },
  "timestamp": "2025-10-17T13:15:06.989Z",
  "fact": "A queen (female cat) can begin mating when she is between 5 and 9 months old."
}
```

**Example Request:**
```bash
curl http://localhost:3000/me
```

## Dependencies

- `express`: Web framework for Node.js
- `axios`: HTTP client for API calls (used in legacy /me endpoint)
- `cors`: Cross-origin resource sharing
- `dotenv`: Environment variable management
- `crypto`: Built-in Node.js module for SHA-256 hashing

## Error Handling

- **String Analysis Endpoints**: Comprehensive validation for request bodies, query parameters, and data types
- **Legacy /me Endpoint**: If the Cat Facts API is unavailable, returns a fallback message with 5-second timeout handling
- **HTTP Status Codes**: Proper status codes (200, 201, 204, 400, 404, 409, 422) with descriptive JSON error messages
- **Input Validation**: Type checking and required field validation for all endpoints

## Testing

### String Analyzer Endpoints

1. **Create a string:**
   ```bash
   curl -X POST http://localhost:3000/strings \
     -H "Content-Type: application/json" \
     -d '{"value": "radar"}'
   ```

2. **Retrieve the string:**
   ```bash
   curl http://localhost:3000/strings/radar
   ```

3. **Filter strings:**
   ```bash
   curl "http://localhost:3000/strings?is_palindrome=true"
   ```

4. **Natural language query:**
   ```bash
   curl "http://localhost:3000/strings/filter-by-natural-language?query=all%20single%20word%20palindromic%20strings"
   ```

5. **Delete the string:**
   ```bash
   curl -X DELETE http://localhost:3000/strings/radar
   ```

### Legacy Endpoint

Test the original endpoint:
```bash
curl http://localhost:3000/me
```

Each request should return updated data with proper error handling for invalid inputs.
