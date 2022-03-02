package com.example.demo.auth;

import com.example.demo.user.dto.UserDTO;

import lombok.Data;

@Data
public class AuthResponse {

	private String token;
	
	private UserDTO user;
	
}
