package com.example.demo.auth;

import org.springframework.data.jpa.repository.JpaRepository;

public interface ITokenRepository extends JpaRepository<Token, String>{

	
	
}
