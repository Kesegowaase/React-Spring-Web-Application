package com.example.demo.user.dto;

import com.example.demo.user.User;

import lombok.Data;

@Data
public class UserDTO {

	private String userID;
	private String username;
	private String image;
	
	public UserDTO(User user) {
		this.setUserID(user.getUserID());
		this.setUsername(user.getUsername());
		this.setImage(user.getImage());
	}
}
