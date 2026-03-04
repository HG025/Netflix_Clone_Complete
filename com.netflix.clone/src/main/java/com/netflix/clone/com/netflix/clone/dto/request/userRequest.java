package com.netflix.clone.com.netflix.clone.dto.request;
import lombok.Data;

@Data
public class userRequest {

    private String email;
    private String password;
    private String fullName;
    private String role;
    private Boolean active;

}
