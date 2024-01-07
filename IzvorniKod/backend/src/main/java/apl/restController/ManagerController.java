package apl.restController;

import apl.dao.ManagerRepository;
import apl.dao.ResearcherRepository;
import apl.dao.TrackerRepository;
import apl.dao.UserRepository;
import apl.domain.Manager;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;


@CrossOrigin(
        origins = "http://localhost:5173",
        methods  = { RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE },
        allowedHeaders = "*",
        allowCredentials = "true"
)
@RestController
@RequestMapping("/manager")
public class ManagerController {

    @Autowired
    private UserRepository userRepo;
    @Autowired
    private ManagerRepository managerRepo;
    @Autowired
    private ResearcherRepository researcherRepo;
    @Autowired
    private TrackerRepository trackerRepo;

    private Long authorize1(Object idObj) {
        if (idObj instanceof Long id) {
            Manager manager=managerRepo.findById(id).orElse(null);
            if (manager==null) return -1L;
            if (manager.isRegistered()) return id;
        }
        return -1L;
    }

    /*
    Long usrId=authorize1(session.getAttribute("id"));
    if (usrId<0) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
    */

    private Long authorize2(Object idObj) {
        if (idObj instanceof Long id) {
            Manager manager=managerRepo.findById(id).orElse(null);
            if (manager==null) return -1L;
            if (manager.isRegistered() && manager.isApproved()) return id;
        }
        return -1L;
    }

    /*
    Long usrId=authorize2(session.getAttribute("id"));
    if (usrId<0) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
    */
}
