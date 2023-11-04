package apl.service;

import apl.domain.User;

import java.util.List;

//ovdje se deklariraju sve funkcije


public interface UserService {
    List<User> listAll();

    User createUser(User user);
}
