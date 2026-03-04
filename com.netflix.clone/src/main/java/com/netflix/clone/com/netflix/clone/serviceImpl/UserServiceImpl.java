package com.netflix.clone.com.netflix.clone.serviceImpl;

import java.time.Instant;
import java.util.Arrays;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.netflix.clone.com.netflix.clone.dao.UserRepository;
import com.netflix.clone.com.netflix.clone.dto.request.userRequest;
import com.netflix.clone.com.netflix.clone.dto.response.MessageResponse;
import com.netflix.clone.com.netflix.clone.dto.response.PageResponse;
import com.netflix.clone.com.netflix.clone.dto.response.UserResponse;
import com.netflix.clone.com.netflix.clone.entity.User;
import com.netflix.clone.com.netflix.clone.enums.Role;
import com.netflix.clone.com.netflix.clone.exception.EmailAlreadyException;
import com.netflix.clone.com.netflix.clone.exception.InvalidRoleException;
import com.netflix.clone.com.netflix.clone.service.EmailService;
import com.netflix.clone.com.netflix.clone.service.UserService;
import com.netflix.clone.com.netflix.clone.util.PaginationUtil;
import com.netflix.clone.com.netflix.clone.util.ServiceUtil;

import jakarta.mail.Message;

@Service
public class UserServiceImpl implements UserService{

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private ServiceUtil ServiceUtil;

    @Autowired
    private EmailService emailService;
    @Override
    public MessageResponse createUser(userRequest userRequest) {
        if(userRepository.findByEmail(userRequest.getEmail()).isPresent()) {
            throw new EmailAlreadyException("Email already exists.");
        }

        validateRole(userRequest.getRole());
        User user = new User();
        user.setEmail(userRequest.getEmail());
        user.setPassword(passwordEncoder.encode(userRequest.getPassword()));
        user.setFullName(userRequest.getFullName());
        user.setRole(Role.valueOf(userRequest.getRole().toUpperCase()));
        user.setActive(true);
        String verificationToken = UUID.randomUUID().toString();
        user.setVerificationToken(verificationToken);
        user.setVerificationTokenExpiry(Instant.now().plusSeconds(86400));
        userRepository.save(user);
        emailService.sendVerificationEmail(userRequest.getEmail(), verificationToken);
        return new MessageResponse("User created successfully!");
    }
    
    private void validateRole(String role) {
        if(Arrays.stream(Role.values()).noneMatch(r -> r.name().equalsIgnoreCase(role))){
            throw new InvalidRoleException("Invalid Role: "+ role);
        }
    }

    @Override
    public MessageResponse updateUser(Long id, userRequest userRequest) {
        User user = ServiceUtil.getUserByIdOrThrow(id);

        ensureNotLastActiveAdmin(user);
        validateRole(userRequest.getRole());
        user.setFullName(userRequest.getFullName());
        user.setRole(Role.valueOf(userRequest.getRole().toUpperCase()));
        userRepository.save(user);
        return new MessageResponse("User Updated Successfully");
    }

    private void ensureNotLastActiveAdmin(User user) {
        if(user.isActive() && user.getRole() == Role.ADMIN){
            long activeAdminCount = userRepository.countByRoleAndActive(Role.ADMIN, true);
            if(activeAdminCount <= 1){
                throw new RuntimeException("Cannot deactivate the last active admin user");
            }
        }
   }

    @Override
    public PageResponse getUsers(int page, int size, String search) {
        Pageable pageable = PaginationUtil.createPageRequest(page, size, "id");
        
        Page<User> userPage;

        if(search != null && !search.trim().isEmpty()){
            userPage = userRepository.searchUser(search.trim(), pageable);
        } else {
            userPage = userRepository.findAll(pageable);
        }

        return PaginationUtil.toPageResponse(userPage, UserResponse::fromEntity);

    }

    @Override
    public MessageResponse deleteUser(Long id, String currentUserEmail) {
        User user = ServiceUtil.getUserByIdOrThrow(id);
        
        if(user.getEmail().equals(currentUserEmail)){
            throw new RuntimeException("You can not delete your own account");
        }

        ensureNotLastAdmin(user, "delete");
        userRepository.deleteById(id);
        return new MessageResponse("User deleted successfully!");
    }

    private void ensureNotLastAdmin(User user, String operation) {
        if(user.getRole() == Role.ADMIN) {
            long adminCount = userRepository.countByRole(Role.ADMIN);
            if(adminCount <= 1){
                throw new RuntimeException("Cannot "+ operation + " the last admin user");
            }
        }
      
    }

    @Override
    public MessageResponse toggleUserStatus(Long id, String currentUserEmail) {
        User user = ServiceUtil.getUserByIdOrThrow(id);

        if(user.getEmail().equals(currentUserEmail)){
            throw new RuntimeException("You can not deactivate your own account");
        }
        ensureNotLastActiveAdmin(user);
        user.setActive(!user.isActive());
        userRepository.save(user);
        return new MessageResponse("User status updated successfully!");
    }

    @Override
    public MessageResponse changeUserRole(Long id, userRequest userRequest) {
        User user = ServiceUtil.getUserByIdOrThrow(id);
        validateRole(userRequest.getRole());

        Role newRole = Role.valueOf(userRequest.getRole().toUpperCase());
        if(user.getRole() == Role.ADMIN && newRole == Role.USER){
            ensureNotLastAdmin(user, "change the role of");
        }
        user.setRole(newRole);
        userRepository.save(user);
        return new MessageResponse("User role updated successfully!");
    }
}
