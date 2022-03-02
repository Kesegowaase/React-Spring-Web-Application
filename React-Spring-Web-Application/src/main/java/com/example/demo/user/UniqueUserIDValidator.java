package com.example.demo.user;

import javax.validation.ConstraintValidator;
import javax.validation.ConstraintValidatorContext;

import org.springframework.beans.factory.annotation.Autowired;

public class UniqueUserIDValidator implements ConstraintValidator<UniqueUserID, String>{

	@Autowired
	IUserRepository userRepository;
	
	@Override
	public boolean isValid(String userID, ConstraintValidatorContext context) {
		User user = userRepository.findByUserID(userID);
		if(user != null) {
			return false;
		}
		return true;
	}

}
