package apl.service.impl;

import apl.dao.UserRepository;
import apl.domain.User;
import apl.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserServiceJpa implements UserService {
    @Autowired
    private UserRepository userRepo;

    @Override
    public List<User> listAll() {
        return userRepo.findAll();
    }
}
