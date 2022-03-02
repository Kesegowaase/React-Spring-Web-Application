package com.example.demo.auth;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.UUID;

import javax.transaction.Transactional;
import org.springframework.security.core.userdetails.UserDetails;

import com.example.demo.user.IUserRepository;
import com.example.demo.user.User;
import com.example.demo.user.dto.UserDTO;

@Service
public class AuthService {

	IUserRepository userRepository;

	PasswordEncoder passwordEncoder;

	ITokenRepository tokenRepository;

	public AuthService(IUserRepository userRepository, PasswordEncoder passwordEncoder,
			ITokenRepository tokenRepository) {
		super();
		this.userRepository = userRepository;
		this.passwordEncoder = passwordEncoder;
		this.tokenRepository = tokenRepository;
	}

	public AuthResponse authenticate(Credentials credentials) {
		User inDB = userRepository.findByUserID(credentials.getUserID());
		if (inDB == null) {
			throw new AuthException();
		}
		boolean matches = passwordEncoder.matches(credentials.getPassword(), inDB.getPassword());
		if (!matches) {
			throw new AuthException();
		}
		UserDTO user = new UserDTO(inDB);
		String token = generateRandomToken();

		Token tokenEntity = new Token();
		tokenEntity.setToken(token);
		tokenEntity.setUser(inDB);
		tokenRepository.save(tokenEntity);

		AuthResponse response = new AuthResponse();
		response.setUser(user);
		response.setToken(token);
		return response;
	}

	@Transactional
	public UserDetails getUserDetails(String token) {
		Optional<Token> optionalToken = tokenRepository.findById(token);
		if (!optionalToken.isPresent()) {
			return null;
		}

		return optionalToken.get().getUser();
	}

	public String generateRandomToken() {
		return UUID.randomUUID().toString().replaceAll("-", "");
	}

	public void clearToken(String token) {
		tokenRepository.deleteById(token);
	}

}
