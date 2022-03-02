package com.example.demo.file.DTO;

import com.example.demo.file.FileAttachment;

import lombok.Data;

@Data
public class FileAttachmentDTO {

	private String name;

	private String fileType;
	
	public FileAttachmentDTO(FileAttachment fileAttachment) {
		this.setName(fileAttachment.getName());
		this.fileType = fileAttachment.getFileType();
	}
}
