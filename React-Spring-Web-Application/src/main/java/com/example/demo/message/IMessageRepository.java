package com.example.demo.message;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import com.example.demo.user.User;

public interface IMessageRepository extends JpaRepository<Message, Long>, JpaSpecificationExecutor<Message> {

	Page<Message> findByUser(User user, Pageable pageable);

}
