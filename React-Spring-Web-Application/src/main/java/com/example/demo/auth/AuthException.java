package com.example.demo.auth;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.UNAUTHORIZED)
public class AuthException extends RuntimeException{

	/**
	 * 
	 */
	private static final long serialVersionUID = 5213737894482043579L;

}
