package apl.service;


import apl.domain.*;
import apl.dto.DtoRequest;
import org.springframework.http.ResponseEntity;

import java.util.List;

//ovdje se deklariraju sve funkcije


public interface UserService {
    List<RegisteredDTO> listAllRegistered();

    List<User> listAll();

    int createUser(User user);

    int logInUser(LogInDTO user);

    int logInAdmin(String pass);

    int updateUser(User user);

    int approveUser(ApprovedDTO user);
    String confirmToken(String token);

    List<DtoRequest> getRequests(Long usrId);
}
