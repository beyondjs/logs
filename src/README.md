# @beyond-js/logs

`@beyond-js/logs` is a logging utility package for applications running on Google Cloud. It provides easy integration
with Google Cloud Logging, allowing you to manage and store logs efficiently. This package uses the
`@google-cloud/logging` library to send logs to Google Cloud.

## Features

-   Easy integration with Google Cloud Logging
-   Supports logging with different severity levels
-   Option to initialize with service account credentials or rely on Google Cloud's default service account

## Installation

```bash
npm install @beyond-js/logs
```

## Usage

### Basic Setup

Create an instance of the Logger class by providing an identifier.

```typescript
import Logger from '@beyond-js/logs';

const logger = new Logger('your-log-identifier');

// Adding a log entry
await logger.add('This is a log message', 'INFO');

// Retrieving log entries
const entries = await logger.get();
console.log(entries);
```

### Configuration with Service Account and Environment Variables

To configure the logger to use a service account JSON file for authentication in a local environment, follow these
steps:

1. **Service Account JSON File**: Ensure that the service account JSON file is placed in the `./credentials` directory.
   This file is necessary for local development to authenticate with Google Cloud Logging.

2. **Environment Variables**:

    - **`PROJECT_ID`**: Set the `PROJECT_ID` environment variable in your `.env` file or directly in your environment.
      The `PROJECT_ID` is only required if your logs are intended for a different project than the one where the service
      is running.

        Create a `.env` file in the root of your project (if it doesn't already exist) and add the following line:

        ```env
        PROJECT_ID=your-gcp-project-id
        ```

    - **`LOGS_DISABLED`**: If the `LOGS_DISABLED` environment variable is set, logging will be disabled. Add the
      following line to your `.env` file to disable logging:
        ```env
        LOGS_DISABLED=true
        ```

By following these steps, you can ensure that your local environment is correctly configured to authenticate and send
logs to Google Cloud Logging. The `PROJECT_ID` environment variable helps direct logs to the appropriate project when
necessary, while the `LOGS_DISABLED` variable can be used to turn off logging when needed.

### Closing the Logger

Although the `@google-cloud/logging` library does not require explicit resource cleanup, you can implement a `close`
method to handle any necessary cleanup operations.

```typescript
logger.close();
```

## Methods

### `constructor(id: string)`

Creates a new instance of the logger. The `id` parameter is required.

### `add(text: string, severity: string = 'INFO'): Promise<void>`

Adds a log entry with the specified text and severity. The severity level defaults to 'INFO' if not provided.

### `get(): Promise<any[]>`

Retrieves log entries for the current log identifier.

### `close(): void`

Placeholder for any cleanup logic if needed in the future.

### Recommendations

#### Avoid Blocking (await) Logging Calls

It is recommended not to use logging in a blocking manner (i.e., using `await` for logging calls). Logging operations
should be non-blocking to prevent any potential delays in your application's main workflow. Instead, consider logging
asynchronously without waiting for the logging operation to complete.

Using `await` with logging can introduce unnecessary latency, especially in high-throughput scenarios or when handling a
large volume of logs. By allowing the logging operations to proceed in the background, you can maintain the
responsiveness and performance of your application.

Example:

```typescript
import Logger from '@beyond-js/logs';

const logger = new Logger('your-log-identifier');

// Non-blocking log entry
logger.add('This is a log message', 'INFO').catch(err => {
	console.error('Error writing log:', err);
});

// Continue with other operations without waiting for the log to complete
```

By following this recommendation, you can ensure that logging does not interfere with the primary operations of your
application, leading to better performance and reliability.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request on GitHub.

## Support

If you have any questions or need help, feel free to open an issue on GitHub or contact the maintainers.

---

This package leverages the power of Google Cloud Logging to help you manage and analyze logs effectively. Whether you
are developing locally or deploying to production, `@beyond-js/logs` provides a seamless and reliable logging solution.
