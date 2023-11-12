package apl.service;

import apl.domain.ChangeUserDTO;
import apl.domain.LogInDTO;
import apl.domain.User;

import java.util.List;

//ovdje se deklariraju sve funkcije


public interface UserService {
    List<User> listAllRegistered();

    List<User> listAll();

    int createUser(User user, Long stationId);

    int logInUser(LogInDTO user);

    int logInAdmin(String pass);

    int updateUser(User user);
    String confirmToken(String token);
}
