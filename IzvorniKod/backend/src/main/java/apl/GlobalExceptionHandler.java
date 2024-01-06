package apl;

import org.springframework.dao.DataAccessException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(DataAccessException.class)
    public ResponseEntity<String> handleDataAccessException(DataAccessException ex) {
        // Extract the original error message from the exception
        String originalErrorMessage = ex.getMessage();

        // Customize the response message based on the original error message or provide a generic message
        String errorMessage = "Database operation failed. " + originalErrorMessage;

        // You can log the exception here if needed
        // logger.error("DataAccessException: {}", originalErrorMessage, ex);

        // Return a ResponseEntity with an HTTP 400 Bad Request status and the error message
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorMessage);
    }
}

