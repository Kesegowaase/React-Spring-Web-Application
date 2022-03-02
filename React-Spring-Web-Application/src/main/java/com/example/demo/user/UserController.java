package com.example.demo.user;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.shared.CurrentUser;
import com.example.demo.shared.GenericResponse;
import com.example.demo.user.dto.UpdateUserDTO;
import com.example.demo.user.dto.UserDTO;

@RestController
@RequestMapping("/api/1.0")
public class UserController {

	@Autowired
	UserService userService;

	@PostMapping("/users")
	public GenericResponse createUser(@Valid @RequestBody User user) {
		userService.save(user);
		return new GenericResponse("User created");
	}

	@GetMapping("/users")
	Page<UserDTO> getUsers(Pageable page, @CurrentUser User user) {
		return userService.getUsers(page, user).map(UserDTO::new);
	}

	@GetMapping("/users/{userID}")
	UserDTO getUser(@PathVariable String userID) {
		User user = userService.getByUserID(userID);
		return new UserDTO(user);
	}

	@PutMapping("/users/{userID}")
	@PreAuthorize("#userID == principal.userID")
	UserDTO updateUser(@Valid @RequestBody UpdateUserDTO updateUser, @PathVariable String userID) {
		User user = userService.updateUser(userID, updateUser);
		return new UserDTO(user);
	}

	@DeleteMapping("/users/{userID}")
	@PreAuthorize("#userID == principal.userID")
	GenericResponse deleteUser(@PathVariable String userID) {
		userService.deleteUser(userID);
		return new GenericResponse("User is removed");
	}
}
