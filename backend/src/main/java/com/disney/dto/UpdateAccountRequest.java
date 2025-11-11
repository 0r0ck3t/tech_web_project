package com.disney.dto;

import lombok.Data;

@Data
public class UpdateAccountRequest {
    private String username;
    private String email;
}

