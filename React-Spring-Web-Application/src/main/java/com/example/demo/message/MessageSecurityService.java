package com.example.demo.message;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.user.User;

@Service
public class MessageSecurityService {

	@Autowired
	IMessageRepository messageRepository;

	public boolean isAllowedToDelete(long id, User loggedInUser) {
		Optional<Message> optionalMessage = messageRepository.findById(id);
		if (!optionalMessage.isPresent()) {
			return false;
		}

		Message message = optionalMessage.get();
		if (message.getUser().getId() != loggedInUser.getId()) {
			return false;
		}

		return true;
	}

}
