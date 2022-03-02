package com.example.demo.user;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface IUserRepository extends JpaRepository<User, Long>{

	User findByUsername(String username);
	
	User findByUserID(String userID);
	
	Page<User> findByUserIDNot(String userID, Pageable page);
	
}
