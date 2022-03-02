package com.example.demo.message.dto;

import com.example.demo.file.DTO.FileAttachmentDTO;
import com.example.demo.message.Message;
import com.example.demo.user.dto.UserDTO;

import lombok.Data;

@Data
public class MessageDTO {

	private long id;

	private String content;

	private long timestamp;

	private UserDTO user;

	private FileAttachmentDTO fileAttachment;

	public MessageDTO(Message message) {
		this.setId(message.getId());
		this.setContent(message.getContent());
		this.setTimestamp(message.getTimestamp().getTime());
		this.setUser(new UserDTO(message.getUser()));
		if (message.getFileAttachment() != null) {
			this.fileAttachment = new FileAttachmentDTO(message.getFileAttachment());
		}
	}

}
