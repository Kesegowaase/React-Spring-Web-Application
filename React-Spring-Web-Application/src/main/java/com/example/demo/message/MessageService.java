package com.example.demo.message;

import java.util.Date;
import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import com.example.demo.file.FileAttachment;
import com.example.demo.file.FileService;
import com.example.demo.file.IFileAttachmentRepository;
import com.example.demo.message.dto.MessageSubmitDTO;
import com.example.demo.user.User;
import com.example.demo.user.UserService;

@Service
public class MessageService {

	IMessageRepository messageRepository;

	UserService userService;

	IFileAttachmentRepository fileAttachmentRepository;

	FileService fileService;

	public MessageService(IMessageRepository messageRepository, IFileAttachmentRepository fileAttachmentRepository,
			FileService fileService, UserService userService) {
		this.messageRepository = messageRepository;
		this.fileAttachmentRepository = fileAttachmentRepository;
		this.fileService = fileService;
		this.userService = userService;
	}

	public void save(MessageSubmitDTO messageSubmitDTO, User user) {
		Message message = new Message();
		message.setContent(messageSubmitDTO.getContent());
		message.setTimestamp(new Date());
		message.setUser(user);
			
		messageRepository.save(message);

		Optional<FileAttachment> optinalFileAttachment = fileAttachmentRepository
				.findById(messageSubmitDTO.getAttachmentId());
		if (optinalFileAttachment.isPresent()) {
			FileAttachment fileAttachment = optinalFileAttachment.get();
			fileAttachment.setMessage(message);
			fileAttachmentRepository.save(fileAttachment);
		}
	}

	public Page<Message> getMessage(Pageable pageable) {
		return messageRepository.findAll(pageable);
	}

	public Page<Message> getMessagesOfUser(String userID, Pageable pageable) {
		User inDB = userService.getByUserID(userID);
		return messageRepository.findByUser(inDB, pageable);
	}

	public Page<Message> getOldMessages(long id, String userID, Pageable pageable) {
		Specification<Message> specification = idLessThan(id);
		if (userID != null) {
			User inDB = userService.getByUserID(userID);
			specification = specification.and(userIs(inDB));
		}

		return messageRepository.findAll(specification, pageable);
	}

	public long getNewMessagesCount(long id, String userID) {
		Specification<Message> specification = idGreaterThan(id);
		if (userID != null) {
			User inDB = userService.getByUserID(userID);
			specification = specification.and(userIs(inDB));
		}
		return messageRepository.count(specification);
	}

	public List<Message> getNewMessages(long id, String userID, Sort sort) {
		Specification<Message> specification = idGreaterThan(id);
		if (userID != null) {
			User inDB = userService.getByUserID(userID);
			specification = specification.and(userIs(inDB));
		}
		return messageRepository.findAll(specification, sort);
	}

	Specification<Message> idLessThan(long id) {
		return (root, query, criteriaBuilder) -> {
			return criteriaBuilder.lessThan(root.get("id"), id);
		};
	}

	Specification<Message> userIs(User user) {
		return (root, query, criteriaBuilder) -> {
			return criteriaBuilder.equal(root.get("user"), user);
		};
	}

	Specification<Message> idGreaterThan(long id) {
		return (root, query, criteriaBuilder) -> {
			return criteriaBuilder.greaterThan(root.get("id"), id);
		};
	}

	public void delete(long id) {
		Message inDB = messageRepository.getById(id);
		if (inDB.getFileAttachment() != null) {
			String fileName = inDB.getFileAttachment().getName();
			fileService.deleteAttachmentFile(fileName);
		}
		messageRepository.deleteById(id);
	}

}
