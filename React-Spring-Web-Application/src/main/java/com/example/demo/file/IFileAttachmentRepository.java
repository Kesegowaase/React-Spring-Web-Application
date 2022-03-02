package com.example.demo.file;

import java.util.Date;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.user.User;

public interface IFileAttachmentRepository extends JpaRepository<FileAttachment, Long>{

	List<FileAttachment> findByDateBeforeAndMessageIsNull(Date date);
	
	List<FileAttachment> findByMessageUser(User user);
	
}
