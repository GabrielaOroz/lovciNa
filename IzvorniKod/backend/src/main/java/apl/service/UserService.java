package apl.service;

import apl.domain.*;

import java.util.List;

//ovdje se deklariraju sve funkcije


public interface UserService {
    List<RegisteredDTO> listAllRegistered();

    List<User> listAll();

    int createUser(User user, Long stationId);

    int logInUser(LogInDTO user);

    int logInAdmin(String pass);

    int updateUser(User user);

    int approveUser(ApprovedDTO user);
    String confirmToken(String token);
}
