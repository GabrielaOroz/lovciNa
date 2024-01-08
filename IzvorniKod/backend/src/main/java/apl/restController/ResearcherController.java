package apl.restController;

import apl.dao.*;
import apl.domain.*;
//import apl.service.ResearcherService;
import apl.dto.DtoAction;
import apl.dto.DtoManager;
import apl.dto.DtoRequest;
import apl.dto.DtoUser;
import apl.enums.HandleRequest;
import apl.service.ResearcherService;
import apl.service.impl.TestResearcherService;
import jakarta.servlet.http.HttpSession;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;


@CrossOrigin(
        origins = "http://localhost:5173",
        methods  = { RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE },
        allowedHeaders = "*",
        allowCredentials = "true"
)
@RestController
@RequestMapping("/researcher")
public class ResearcherController {
    @Autowired
    private ResearcherService researcherService;

    @Autowired
    TestResearcherService testresearcherService;

    @Autowired
    private UserRepository userRepo;
    @Autowired
    private ManagerRepository managerRepo;
    @Autowired
    private ResearcherRepository researcherRepo;
    @Autowired
    private TrackerRepository trackerRepo;

    @Autowired
    private ActionRepository actionRepo;

    private Long authorize1(Object idObj) {

        if (idObj instanceof Long id) {
            Researcher researcher=researcherRepo.findById(id).orElse(null);
            if (researcher==null) return -1L;
            if (researcher.isRegistered()) return id;
        }
        return -1L;
    }

    /*
    Long usrId=authorize1(session.getAttribute("id"));
    if (usrId<0) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
    */

    private Long authorize2(Object idObj) {

        if (idObj instanceof Long id) {
            Researcher researcher=researcherRepo.findById(id).orElse(null);
            if (researcher==null) return -1L;
            if (researcher.isRegistered() && researcher.isApproved()) return id;
        }
        return -1L;
    }

    /*
    Long usrId=authorize2(session.getAttribute("id"));
    if (usrId<0) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
    */

    @PostMapping("/create-requests")
    public ResponseEntity<DtoUser> createAction(@RequestBody Action action, HttpSession session){
        Long usrId=authorize2(session.getAttribute("id"));
        if (usrId<0) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);

        DtoUser user1 = researcherService.createAction(action, usrId);
        if (user1!=null) {
            System.out.println("not null");
            return ResponseEntity.ok(user1);
        }
        System.out.println("null");
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);

    }

    @GetMapping("/managers")
    public ResponseEntity<List<DtoManager>> getManagers(HttpSession session){
        Long usrId = authorize2(session.getAttribute("id"));

        if (usrId<0) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);

        if (researcherService.listAllManagersDto() != null) {
            return ResponseEntity.ok(researcherService.listAllManagersDto());
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }

    @GetMapping("/actions")
    public ResponseEntity<List<DtoAction>> getActions(HttpSession session) {
        Long usrId = authorize2(session.getAttribute("id"));

        if (usrId<0) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);

        if (researcherService.getAllActions(usrId) != null) {
            return ResponseEntity.ok(researcherService.getAllActions(usrId));
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }

    @GetMapping("/finished-actions")
    public ResponseEntity<List<DtoAction>> getFinishedActions(HttpSession session) {
        Long usrId = authorize2(session.getAttribute("id"));

        if (usrId<0) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);

        if (researcherService.getAllActions(usrId) != null) {
            return ResponseEntity.ok(researcherService.getAllFinishedActions(usrId));
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(researcherService.getAllActions(usrId));
        }
    }

    @GetMapping("/unfinished-actions")
    public ResponseEntity<List<DtoAction>> getUnfinishedActions(HttpSession session) {
        Long usrId = authorize2(session.getAttribute("id"));

        if (usrId<0) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);

        if (researcherService.getAllActions(usrId) != null) {
            return ResponseEntity.ok(researcherService.getAllUnfinishedActions(usrId));
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(researcherService.getAllActions(usrId));
        }
    }
}
