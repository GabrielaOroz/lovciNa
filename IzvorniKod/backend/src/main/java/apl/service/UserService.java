package apl.service;

import apl.domain.ChangeUserDTO;
import apl.domain.LogInDTO;
import apl.domain.RegisteredDTO;
import apl.domain.User;

import java.util.List;

//ovdje se deklariraju sve funkcije


public interface UserService {
    List<RegisteredDTO> listAllRegistered();

    List<User> listAll();

    int createUser(User user, Long stationId);

    int logInUser(LogInDTO user);

    int logInAdmin(String pass);

    int updateUser(User user);

    String confirmToken(String token);
}
