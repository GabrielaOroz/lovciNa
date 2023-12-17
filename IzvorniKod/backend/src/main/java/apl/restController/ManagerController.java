package apl.restController;

import apl.dao.ManagerRepository;
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
    private ManagerRepository managerRepo;

    private Long authorize1(Object idObj) {
        if (idObj instanceof Long) {
            Long id = (Long) idObj;
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
        if (idObj instanceof Long) {
            Long id = (Long) idObj;
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
