package apl.restController;

import apl.dao.ManagerRepository;
import apl.dao.ResearcherRepository;
import apl.dao.TrackerRepository;
import apl.dao.UserRepository;
import apl.domain.Tracker;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(
        origins = "http://localhost:5173",
        methods  = { RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE },
        allowedHeaders = "*",
        allowCredentials = "true"
)
@RestController
@RequestMapping("/tracker")
public class TrackerController {

    @Autowired
    private UserRepository userRepo;
    @Autowired
    private ManagerRepository managerRepo;
    @Autowired
    private ResearcherRepository researcherRepo;
    @Autowired
    private TrackerRepository trackerRepo;

    private Long authorize(Object idObj) {
        if (idObj instanceof Long id) {
            Tracker tracker=trackerRepo.findById(id).orElse(null);
            if (tracker==null) return -1L;
            if (tracker.isRegistered()) return id;
        }
        return -1L;
    }

    /*
    Long usrId=authorize(session.getAttribute("id"));
    if (usrId<0) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
    */
}
