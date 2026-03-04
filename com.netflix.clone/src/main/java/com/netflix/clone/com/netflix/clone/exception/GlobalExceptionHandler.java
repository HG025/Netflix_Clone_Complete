package com.netflix.clone.com.netflix.clone.exception;

import java.time.Instant;
import java.util.Map;

import org.apache.catalina.connector.ClientAbortException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.support.DefaultMessageSourceResolvable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.async.AsyncRequestNotUsableException;

@ControllerAdvice
public class GlobalExceptionHandler {

    private static final Logger log = LoggerFactory.getLogger(GlobalExceptionHandler.class);
    
    @ExceptionHandler(AccountDeactivatedException.class)
    public ResponseEntity<Map<String,Object>>handleAccountDeactivated(AccountDeactivatedException ex) {
        log.warn("AccountDeactivatedException: {}", ex.getMessage(), ex);
        return buildResponse(HttpStatus.FORBIDDEN, ex.getMessage());
    }

    @ExceptionHandler(BadCredentialException.class)
    public ResponseEntity<Map<String,Object>>handleBadCredentials(BadCredentialException ex) {
        log.warn("BadCredentialsException: {}", ex.getMessage(), ex);
        return buildResponse(HttpStatus.UNAUTHORIZED, ex.getMessage());
    }

    @ExceptionHandler(EmailAlreadyException.class)
    public ResponseEntity<Map<String,Object>>handleEmailAlready(EmailAlreadyException ex) {
        log.warn("EmailAlreadyException: {}", ex.getMessage(), ex);
        return buildResponse(HttpStatus.CONFLICT, ex.getMessage());
    }

    @ExceptionHandler(EmailNotVerifiedException.class)
    public ResponseEntity<Map<String,Object>>handleEmailNotVerified(EmailNotVerifiedException ex) {
        log.warn("EmailNotVerifiedException: {}", ex.getMessage(), ex);
        return buildResponse(HttpStatus.FORBIDDEN, ex.getMessage());
    }

    @ExceptionHandler(EmailSendingException.class)
    public ResponseEntity<Map<String,Object>>handleEmailSending(EmailSendingException ex) {
        log.warn("EmailSendingException: {}", ex.getMessage(), ex);
        return buildResponse(HttpStatus.INTERNAL_SERVER_ERROR, ex.getMessage());
    }

    @ExceptionHandler(InvalidCredentialException.class)
    public ResponseEntity<Map<String,Object>>handleInvalidCredential(InvalidCredentialException ex) {
        log.warn("InvalidCredentialException: {}", ex.getMessage(), ex);
        return buildResponse(HttpStatus.BAD_REQUEST, ex.getMessage());
    }

    @ExceptionHandler(InvalidRoleException.class)
    public ResponseEntity<Map<String,Object>>handleInvalidRole(InvalidRoleException ex) {
        log.warn("InvalidRoleException: {}", ex.getMessage(), ex);
        return buildResponse(HttpStatus.BAD_REQUEST, ex.getMessage());
    }

    @ExceptionHandler(InvalidTokenException.class)
    public ResponseEntity<Map<String,Object>>handleInvalidToken(InvalidTokenException ex) {
        log.warn("InvalidTokenException: {}", ex.getMessage(), ex);
        return buildResponse(HttpStatus.BAD_REQUEST, ex.getMessage());
    }

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<Map<String,Object>>handleResourceNotFound(ResourceNotFoundException ex) {
        log.warn("ResourceNotFoundException: {}", ex.getMessage(), ex);
        return buildResponse(HttpStatus.NOT_FOUND, ex.getMessage());
    }


    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String,Object>>handleValidException(MethodArgumentNotValidException ex){
        String message = ex.getBindingResult().getFieldErrors().stream().findFirst()
        .map(DefaultMessageSourceResolvable:: getDefaultMessage)
        .orElse("Invalid Request");

        HttpStatus status = HttpStatus.BAD_REQUEST;
        return ResponseEntity.status(status)
        .body(Map.of("timestamp", Instant.now(),
        "status", status.value(),
         "error", message));
    }

    @ExceptionHandler({AsyncRequestNotUsableException.class, ClientAbortException.class})
    public void handleCliendAbort(Exception ex){
        log.debug("Client closed connection during streaming (expected video seeking/buffering) : {}", ex.getMessage());
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String,Object>> handleGeneric(Exception ex){
        log.warn("Exception: {}", ex.getMessage(), ex);
        return buildResponse(HttpStatus.INTERNAL_SERVER_ERROR,ex.getMessage());
    }

    private ResponseEntity<Map<String,Object>>buildResponse(HttpStatus status, String message){
        Map<String, Object> body = Map.of("timestamp", Instant.now(), "error", message);
        return ResponseEntity.status(status).body(body);
    }

}
