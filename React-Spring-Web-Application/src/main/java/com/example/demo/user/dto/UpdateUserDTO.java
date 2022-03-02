
package com.example.demo.user.dto;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

import com.example.demo.shared.FileType;

import lombok.Data;

@Data
public class UpdateUserDTO {

	@NotNull(message = "{demo.constraint.username.NotNull.message}")
	@Size(min = 4, max = 16, message = "{demo.constraint.username.Size.message}")
	private String username;
	
	@FileType(message = "{demo.constraint.FileType.message}", types = {"jpeg","png"})
	private String image;
}
