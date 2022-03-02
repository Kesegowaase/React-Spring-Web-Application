package com.example.demo.message;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort.Direction;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.message.dto.MessageDTO;
import com.example.demo.message.dto.MessageSubmitDTO;
import com.example.demo.shared.CurrentUser;
import com.example.demo.shared.GenericResponse;
import com.example.demo.user.User;

@RestController
@RequestMapping("/api/1.0")
public class MessageController {

	@Autowired
	MessageService messageService;

	@PostMapping("/messages")
	GenericResponse saveExample(@Valid @RequestBody MessageSubmitDTO message, @CurrentUser User user) {
		messageService.save(message, user);
		return new GenericResponse("Messages is saved");
	}

	@GetMapping("/messages")
	Page<MessageDTO> getMessage(@PageableDefault(sort = "id", direction = Direction.DESC) Pageable pageable) {
		return messageService.getMessage(pageable).map(MessageDTO::new);
	}

	@GetMapping({ "/messages/{id:[0-9]+}", "/users/{userID}/messages/{id:[0-9]+}" })
	ResponseEntity<?> getMessageRelative(@PageableDefault(sort = "id", direction = Direction.DESC) Pageable pageable,
			@PathVariable long id, @PathVariable(required = false) String userID,
			@RequestParam(name = "count", required = false, defaultValue = "false") boolean count,
			@RequestParam(name = "direction", defaultValue = "before") String direction) {
		if (count) {
			long newMessageCount = messageService.getNewMessagesCount(id, userID);
			Map<String, Long> response = new HashMap<>();
			response.put("count", newMessageCount);
			return ResponseEntity.ok(response);
		}
		if (direction.equals("after")) {
			List<MessageDTO> newMessages = messageService.getNewMessages(id, userID, pageable.getSort()).stream()
					.map(MessageDTO::new).collect(Collectors.toList());
			return ResponseEntity.ok(newMessages);
		}
		return ResponseEntity.ok(messageService.getOldMessages(id, userID, pageable).map(MessageDTO::new));
	}

	@GetMapping("/users/{userID}/messages")
	Page<MessageDTO> getUserMessages(@PathVariable String userID,
			@PageableDefault(sort = "id", direction = Direction.DESC) Pageable pageable) {
		return messageService.getMessagesOfUser(userID, pageable).map(MessageDTO::new);
	}

	@DeleteMapping("/messages/{id:[0-9]+}")
	@PreAuthorize("@messageSecurityService.isAllowedToDelete(#id, principal)")
	GenericResponse deleteMessage(@PathVariable long id) {
		messageService.delete(id);
		return new GenericResponse("Message Removed");
	}

}
