package com.netflix.clone.com.netflix.clone.service;

import org.jspecify.annotations.Nullable;

import com.netflix.clone.com.netflix.clone.dto.request.userRequest;
import com.netflix.clone.com.netflix.clone.dto.response.MessageResponse;
import com.netflix.clone.com.netflix.clone.dto.response.PageResponse;

public interface UserService {

    MessageResponse createUser(userRequest userRequest);

    MessageResponse updateUser(Long id, userRequest userRequest);

   PageResponse getUsers(int page, int size, String search);

   MessageResponse deleteUser(Long id, String currentUserEmail);

   MessageResponse toggleUserStatus(Long id, String currentUserEmail);

   MessageResponse changeUserRole(Long id, userRequest userRequest);

}
