package apl.service.impl;

import apl.dao.UserRepository;
import apl.domain.User;
import apl.service.RequestDeniedException;
import apl.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.Assert;

import java.util.List;

//ovdje se pišu sve funkcije koje nam trebaju


@Service
public class UserServiceJpa implements UserService {
    //Dependency injection
    @Autowired  //kažemo mu da nam automatski "pospaja" sve reference i objekte koje smo mi stvorili
    private UserRepository userRepo;    //varijabla objekta

    @Override
    public List<User> listAll() {
        return userRepo.findAll();      //findAll nadljeduje iz JpaRepository
    }

    @Override
    public User createUser(User user) {
        Assert.notNull(user, "User object must be given");  //moramo dobit objekt, ne možemo u bazu stavit null
        Assert.isNull(user.getId(), "Student ID must be null, not " + user.getId());    //zato što ga mi settiramo autom s generated value

        if (userRepo.countByEmail(user.getEmail()) > 0){
            throw new RequestDeniedException("User with email " + user.getEmail() + "already exists!");
        }
        if (userRepo.countByUsername(user.getUsername()) > 0){
            throw new RequestDeniedException("User with username " + user.getUsername() + "already exists!");
        }

        return userRepo.save(user);
    }
}
