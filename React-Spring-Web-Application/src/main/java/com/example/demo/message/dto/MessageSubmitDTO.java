package com.example.demo.message.dto;

import javax.validation.constraints.Size;

import lombok.Data;

@Data
public class MessageSubmitDTO {

	@Size(min = 1, max = 1000, message = "{demo.constraint.Content.Size.message}")
	private String content;

	
	private long attachmentId;
	
}
