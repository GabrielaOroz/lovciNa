package apl.restController;

import apl.dao.ManagerRepository;
import apl.dao.ResearcherRepository;
import apl.dao.TrackerRepository;
import apl.dao.UserRepository;
import apl.domain.*;
import apl.dto.*;
import apl.enums.MediumType;
import apl.service.ManagerService;
import apl.service.impl.ManagerServiceJpa;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;


@CrossOrigin(
        origins = "https://wildtrack-bc08.onrender.com",
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

    @Autowired
    private ManagerService managerService;

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

    @GetMapping("/station")
    public ResponseEntity<DtoStation> getExistingStation(HttpSession session) {
        Long usrId = authorize2(session.getAttribute("id"));
        if (usrId<0) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);

        try {
            return ResponseEntity.ok(managerService.getExistingStation(usrId));
        } catch (Exception e){
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }

    }

    @GetMapping("/trackers")
    public ResponseEntity<List<DtoTracker>> getFreeTrackers(HttpSession session) {
        Long usrId = authorize2(session.getAttribute("id"));
        if (usrId<0) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);

        List<DtoTracker> dtoTrackers = managerService.getAvailableTrackers();
        if (dtoTrackers != null) {
            return ResponseEntity.ok(dtoTrackers);
        } else {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @PostMapping("/selected-station")
    public ResponseEntity<Station> addSelectedStation(@RequestBody Station station, HttpSession session) {
        Long usrId = authorize2(session.getAttribute("id"));
        if (usrId<0) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);

        Station station1 = managerService.addNewStation(usrId, station);
        if (station1 != null) {
            return ResponseEntity.ok(station1);
        } else {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @PostMapping("/saveAbilities")
    public ResponseEntity<Station> saveAbilities(@RequestBody Map<Long, List<MediumType>> selectedAbilities, HttpSession session) {
        Long usrId = authorize2(session.getAttribute("id"));
        if (usrId<0) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);

        Station station = managerService.saveTrackerQualification(usrId, selectedAbilities);
        if (station != null) {
            return ResponseEntity.ok(station);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }

    @GetMapping("/incoming-requests")
    public ResponseEntity<List<DtoAction>> getIncomingRequests(HttpSession session) {
        Long usrId = authorize2(session.getAttribute("id"));
        if (usrId<0) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);

        List<DtoAction> actions = managerService.getIncomingRequests(usrId);
        if (actions != null) {
            return ResponseEntity.ok(actions);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }

    @GetMapping("/available-trackers")
    public ResponseEntity<List<DtoTracker>> getAvailableTrackersForManager(HttpSession session) {
        Long usrId = authorize2(session.getAttribute("id"));
        if (usrId<0) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);

        try {
            return ResponseEntity.ok(managerService.getAvailableTrackersForManager(usrId));
        } catch (Exception e){
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }

    }

    @PostMapping("/submit-action")
    public ResponseEntity<Action> addSubmittedAction(@RequestBody RequestDTO requestDTO, HttpSession session) {
        Long usrId = authorize2(session.getAttribute("id"));
        if (usrId<0) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);

        Action action = managerService.submitAction(requestDTO);
        if (action != null) {
            return ResponseEntity.ok(action);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }


    //fill db with media
    @PostMapping("/saveMedia")
    public ResponseEntity<String> saveMedia() {
        managerService.saveMediaToDB();
        return ResponseEntity.ok("Successful.");
    }


}
