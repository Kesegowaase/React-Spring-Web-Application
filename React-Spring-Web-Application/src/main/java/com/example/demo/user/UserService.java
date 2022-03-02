package com.example.demo.user;

import java.io.IOException;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.demo.error.NotFoundException;
import com.example.demo.file.FileService;
import com.example.demo.user.dto.UpdateUserDTO;

@Service
public class UserService {

	IUserRepository userRepository;
	PasswordEncoder passwordEncoder;
	FileService fileService;

	public UserService(IUserRepository userRepository, PasswordEncoder passwordEncoder, FileService fileService) {
		this.userRepository = userRepository;
		this.passwordEncoder = passwordEncoder;
		this.fileService = fileService;
	}

	public void save(User user) {
		user.setPassword(this.passwordEncoder.encode(user.getPassword()));
		userRepository.save(user);
	}

	public Page<User> getUsers(Pageable page, User user) {
		if (user != null) {
			return userRepository.findByUserIDNot(user.getUserID(), page);
		}
		return userRepository.findAll(page);
	}

	public User getByUserID(String userID) {
		User inDB = userRepository.findByUserID(userID);
		if (inDB == null) {
			throw new NotFoundException();
		}
		return inDB;
	}

	public User updateUser(String userID, UpdateUserDTO updateUser) {
		User inDB = getByUserID(userID);
		inDB.setUsername(updateUser.getUsername());
		if (updateUser.getImage() != null) {
			String oldImageName = inDB.getImage();
			try {
				String storedFileName = fileService.writeBase64EncodedStringToFile(updateUser.getImage());
				inDB.setImage(storedFileName);
			} catch (IOException e) {
				e.printStackTrace();
			}
			fileService.deleteProfileImage(oldImageName);
		}
		return userRepository.save(inDB);
	}

	public void deleteUser(String userID) {
		User inDB = userRepository.findByUserID(userID);
		fileService.deleteAllStoredFilesForUser(inDB);
		userRepository.delete(inDB);
	}

}
