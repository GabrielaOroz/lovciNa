package apl.service;

import apl.domain.User;

import java.util.List;

//ovdje se deklariraju sve funkcije


public interface UserService {
    List<User> listAll();

    Boolean createUser(User user);
}
