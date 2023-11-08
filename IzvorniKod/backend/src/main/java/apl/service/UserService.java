package apl.service;

import apl.domain.LogInDTO;
import apl.domain.User;
import org.springframework.http.ResponseEntity;

import java.util.List;

//ovdje se deklariraju sve funkcije


public interface UserService {
    List<User> listAll();

    ResponseEntity<String> createUser(User user);

    ResponseEntity<String> logInUser(LogInDTO user);

    String confirmToken(String token);
}
