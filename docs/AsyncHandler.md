# AsyncHandler Utility Documentation

## What is it?
The `asyncHandler` is a higher-order function designed to simplify error handling in asynchronous Express routes/controllers.

## Why do we use it?
1.  **Cleaner Code**: Removes repetitive `try-catch` blocks.
2.  **DRY (Don't Repeat Yourself)**: Centralizes error handling.
3.  **Automatic Error Propagation**: Caches errors and passes them to the error handler.
4.  **Error Consistency**: Standardizes the error response format.

## How it works
```javascript
export const asyncHandler = fn => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch((error) => {
        return res.status(400).json({
            success: false,
            message: error.message || "Something went wrong"
        });
    });
};
```

## What happens in the next step?
1.  **Incoming Request**: Express calls the wrapped function.
2.  **Logic Execution**: Your `async` logic runs.
3.  **Error Occurs**: Any failure trigger the `.catch()` block.
4.  **Response**: A structured error response is sent to the client.

## Usage Example
```javascript
const myController = asyncHandler(async (req, res) => {
    const data = await service.getData();
    res.status(200).json(data);
});
```
