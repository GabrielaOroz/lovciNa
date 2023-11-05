package apl.service.impl;

import apl.dao.*;
import apl.domain.Manager;
import apl.domain.Researcher;
import apl.domain.Tracker;
import apl.domain.User;
import apl.service.RequestDeniedException;
import apl.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.util.Assert;

import java.util.List;

//ovdje se pišu sve funkcije koje nam trebaju


@Service
public class UserServiceJpa implements UserService {
    //Dependency injection
    @Autowired  //kažemo mu da nam automatski "pospaja" sve reference i objekte koje smo mi stvorili
    private UserRepository userRepo;    //varijabla objekta
    @Autowired
    private ManagerRepository managerRepo;
    @Autowired
    private ResearcherRepository researcherRepo;
    @Autowired
    private StationRepository stationRepo;
    @Autowired
    private TrackerRepository trackerRepo;

    private BCryptPasswordEncoder bCryptPasswordEncoder;


    @Override
    public List<User> listAll() {
        return userRepo.findAll();      //findAll nadljeduje iz JpaRepository
    }

    @Override
    public Boolean createUser(User user) {
        Assert.notNull(user, "User object must be given");  //moramo dobit objekt, ne možemo u bazu stavit null
        Assert.isNull(user.getId(), "Student ID must be null, not " + user.getId());    //zato što ga mi settiramo autom s generated value

        if (userRepo.countByEmail(user.getEmail()) > 0){
            throw new RequestDeniedException("User with email " + user.getEmail() + "already exists!");
        }
        if (userRepo.countByUsername(user.getUsername()) > 0){
            throw new RequestDeniedException("User with username " + user.getUsername() + "already exists!");
        }
        if (userRepo.countByEmail(user.getEmail()) > 0 && userRepo.countByUsername(user.getUsername()) > 0){
            throw new RequestDeniedException("User with email " + user.getEmail() + " and username " + user.getUsername() + "already exists!");
        }

        //String encodedPswd = bCryptPasswordEncoder.encode(user.getPassword());
        //user.setPassword(encodedPswd);      //kodiranje lozinke

        userRepo.save(user);

        if(user.getRole() == 1){
            researcherRepo.save(new Researcher(user.getId()));
        } else if(user.getRole() == 2){
            managerRepo.save(new Manager(user.getId(), 25L));
        } else {
            trackerRepo.save(new Tracker(user.getId(), 36L));
        }

        return true;
    }
}
