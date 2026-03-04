package com.netflix.clone.com.netflix.clone.util;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.netflix.clone.com.netflix.clone.dao.UserRepository;
import com.netflix.clone.com.netflix.clone.dao.VideoRepository;
import com.netflix.clone.com.netflix.clone.entity.User;
import com.netflix.clone.com.netflix.clone.entity.Video;
import com.netflix.clone.com.netflix.clone.exception.ResourceNotFoundException;

// component means that it's object and bean is created and managed by IOC controller
@Component
public class ServiceUtil {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private VideoRepository videoRepository;

    public User getUserByEmailOrThrow(String email){
        return userRepository.findByEmail(email)
        .orElseThrow(() -> new ResourceNotFoundException("User not found with email:" +email));
    }

    public User getUserByIdOrThrow(Long id) {
        return userRepository.findById(id)
        .orElseThrow(() -> new ResourceNotFoundException("User not found with Id:" +id));
    }

    public Video getVideoByIdOrThrow(Long id) {
        return videoRepository.findById(id)
        .orElseThrow(() -> new ResourceNotFoundException("Video not found with ID:"+id));
    }


}
