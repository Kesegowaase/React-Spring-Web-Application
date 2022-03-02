package com.example.demo.user;

import java.util.Collection;
import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.OneToMany;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Pattern;
import javax.validation.constraints.Size;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.AuthorityUtils;
import org.springframework.security.core.userdetails.UserDetails;

import com.example.demo.auth.Token;
import com.example.demo.message.Message;

import lombok.Data;

@Data
@Entity
public class User implements UserDetails{

	/**
	 * 
	 */
	private static final long serialVersionUID = 4841768806917119411L;

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private long id;
	
	@NotNull(message = "{demo.constraint.userID.NotNull.message}")
	@Size(min = 4, max = 16, message = "{demo.constraint.userID.Size.message}")
	@UniqueUserID
	private String userID;
	
	@NotNull(message = "{demo.constraint.username.NotNull.message}")
	@Size(min = 4, max = 16, message = "{demo.constraint.username.Size.message}")
	@UniqueUsername
	private String username;
	
	@NotNull(message = "{demo.constraint.password.NotNull.message}")
	@Size(min = 8, max = 16, message = "{demo.constraint.password.Size.message}")
	@Pattern(regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).*$", message = "{demo.constraint.password.Pattern.message}")
	private String password;
	
	private String image;
	
	@OneToMany(mappedBy = "user", cascade = CascadeType.REMOVE)
	private List<Message> messages;
	
	@OneToMany(mappedBy = "user", cascade = CascadeType.REMOVE)
	private List<Token> tokens;

	@Override
	public Collection<? extends GrantedAuthority> getAuthorities() {
		return AuthorityUtils.createAuthorityList("Role_user");
	}

	@Override
	public boolean isAccountNonExpired() {
		return true;
	}

	@Override
	public boolean isAccountNonLocked() {
		return true;
	}

	@Override
	public boolean isCredentialsNonExpired() {
		return true;
	}

	@Override
	public boolean isEnabled() {
		return true;
	}
	
}
