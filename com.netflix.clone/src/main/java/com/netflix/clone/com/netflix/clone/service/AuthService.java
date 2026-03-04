package com.netflix.clone.com.netflix.clone.service;

import org.jspecify.annotations.Nullable;

import com.netflix.clone.com.netflix.clone.dto.request.userRequest;
import com.netflix.clone.com.netflix.clone.dto.response.EmailValidationResponse;
import com.netflix.clone.com.netflix.clone.dto.response.LoginResponse;
import com.netflix.clone.com.netflix.clone.dto.response.MessageResponse;

import jakarta.validation.Valid;

public interface AuthService {

    MessageResponse signup(@Valid userRequest userRequest);

    LoginResponse login(String email, String password);

   EmailValidationResponse validateEmail(String email);

   MessageResponse verifyEmail(String token);

   MessageResponse resendVerification(String email);

   MessageResponse forgotPassword(String email);
   
   MessageResponse resetPassword(String token, String newPassword);

   MessageResponse changePassword(String email, String string, String string2);

   LoginResponse currentUser(String email);


}
