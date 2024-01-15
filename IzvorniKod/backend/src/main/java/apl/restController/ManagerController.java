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

        if (managerService.getExistingStation(usrId) != null) {
            return ResponseEntity.ok(managerService.getExistingStation(usrId));
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }

    @GetMapping("/trackers")
    public ResponseEntity<List<DtoTracker>> getFreeTrackers(HttpSession session) {
        Long usrId = authorize2(session.getAttribute("id"));
        if (usrId<0) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);

        if (managerService.getAvailableTrackers() != null) {
            return ResponseEntity.ok(managerService.getAvailableTrackers());
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }

    @PostMapping("/selected-station")
    public ResponseEntity<Station> addSelectedStation(@RequestBody Station station, HttpSession session) {
        Long usrId = authorize2(session.getAttribute("id"));
        if (usrId<0) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);

        if (managerService.addNewStation(usrId, station) != null) {
            return ResponseEntity.ok(managerService.addNewStation(usrId, station));
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }

    @PostMapping("/saveAbilities")
    public ResponseEntity<Station> saveAbilities(@RequestBody Map<Long, List<MediumType>> selectedAbilities, HttpSession session) {
        Long usrId = authorize2(session.getAttribute("id"));
        if (usrId<0) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);

        if (managerService.saveTrackerQualification(usrId, selectedAbilities) != null) {
            return ResponseEntity.ok(managerService.saveTrackerQualification(usrId, selectedAbilities));
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }

    @GetMapping("/incoming-requests")
    public ResponseEntity<List<DtoAction>> getIncomingRequests(HttpSession session) {
        Long usrId = authorize2(session.getAttribute("id"));
        if (usrId<0) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);

        if (managerService.getIncomingRequests(usrId) != null) {
            return ResponseEntity.ok(managerService.getIncomingRequests(usrId));
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }

    @GetMapping("/available-trackers")
    public ResponseEntity<List<DtoTracker>> getAvailableTrackersForManager(HttpSession session) {
        Long usrId = authorize2(session.getAttribute("id"));
        if (usrId<0) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);

        if (managerService.getAvailableTrackersForManager(usrId) != null) {
            return ResponseEntity.ok(managerService.getAvailableTrackersForManager(usrId));
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }

    @PostMapping("/submit-action")
    public ResponseEntity<Action> addSubmittedAction(@RequestBody RequestDTO requestDTO, HttpSession session) {
        Long usrId = authorize2(session.getAttribute("id"));
        if (usrId<0) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);

        if (managerService.submitAction(requestDTO) != null) {
            return ResponseEntity.ok(managerService.submitAction(requestDTO));
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }



}
