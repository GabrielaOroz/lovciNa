package apl.service;

import apl.domain.LogInDTO;
import apl.domain.User;
import org.springframework.http.ResponseEntity;

import java.util.List;

//ovdje se deklariraju sve funkcije


public interface UserService {
    List<User> listAll();

    int createUser(User user, Long stationId);

    int logInUser(LogInDTO user);

    String confirmToken(String token);
}
