package apl.service;

import apl.domain.User;

import java.util.List;

//ovdje se deklariraju sve funkcije


public interface UserService {
    List<User> listAll();

    String createUser(User user);

    Boolean logInUser(User user);
}
