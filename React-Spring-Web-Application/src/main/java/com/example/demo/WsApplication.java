package com.example.demo;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Profile;

import com.example.demo.message.MessageService;
import com.example.demo.message.dto.MessageSubmitDTO;
import com.example.demo.user.User;
import com.example.demo.user.UserService;

@SpringBootApplication
public class WsApplication {

	public static void main(String[] args) {
		SpringApplication.run(WsApplication.class, args);
	}

	@Bean
	@Profile("dev")
	CommandLineRunner createInitialUsers(UserService userService, MessageService messageService) {
		return (args) -> {
			try {
				userService.getByUserID("user1");
			} catch (Exception e) {
				for (int i = 1; i <= 25; i++) {
					User user = new User();
					user.setUserID("user" + i);
					user.setUsername("display" + i);
					user.setPassword("password");
					userService.save(user);
					for (int j = 1; j <= 20; j++) {
						MessageSubmitDTO messageSubmitDTO = new MessageSubmitDTO();
						messageSubmitDTO.setContent("message: (" + j + ") from user (" + i + ")");
						messageService.save(messageSubmitDTO, user);
					}
				}
			}

		};
	}

}
