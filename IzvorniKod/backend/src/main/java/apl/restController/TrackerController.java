package apl.restController;

import apl.dao.ManagerRepository;
import apl.dao.ResearcherRepository;
import apl.dao.TrackerRepository;
import apl.dao.UserRepository;
import apl.domain.ActionComment;
import apl.domain.AnimalComment;
import apl.domain.Tracker;
import apl.domain.TrackerDTO;
import apl.dto.*;
import apl.service.impl.TrackerServiceJpa;
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

    @Autowired
    private TrackerServiceJpa trackerService;

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

    @GetMapping("/myInfo")
    public ResponseEntity<TrackerDTO> getTrackerInformation(HttpSession session) {
        Long usrId = authorize(session.getAttribute("id"));
        if (usrId<0) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);

        try {
            return ResponseEntity.ok(trackerService.getTrackerInfo(usrId));
        } catch (Exception e){
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }


    @GetMapping("/trackers")
    public ResponseEntity<List<DtoTracker>> allTrackersOnAction(HttpSession session) {
        Long usrId = authorize(session.getAttribute("id"));
        if (usrId<0) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);

        try {
            return ResponseEntity.ok(trackerService.getAllTrackersOnAction(usrId));
        } catch (Exception e){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }

    }

    @GetMapping("/individuals")
    public ResponseEntity<List<DtoAnimal>> allIndividuals(HttpSession session) {
        Long usrId = authorize(session.getAttribute("id"));
        if (usrId<0) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);


        try {
            return ResponseEntity.ok(trackerService.getAllAnimals(usrId));
        } catch (Exception e){
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @GetMapping("/species")
    public ResponseEntity<List<DtoSpecies>> allSpecies(HttpSession session) {
        Long usrId = authorize(session.getAttribute("id"));
        if (usrId<0) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);


        try {
            return ResponseEntity.ok(trackerService.getAllSpecies(usrId));
        } catch (Exception e){
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @GetMapping("/habitats")
    public ResponseEntity<List<DtoHabitat>> allHabitats(HttpSession session) {
        Long usrId = authorize(session.getAttribute("id"));
        if (usrId<0) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);


        try {
            return ResponseEntity.ok(trackerService.getAllHabitats(usrId));
        } catch (Exception e){
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @GetMapping("/tasks")
    public ResponseEntity<List<DtoTask>> allTasks(HttpSession session) {
        Long usrId = authorize(session.getAttribute("id"));
        if (usrId<0) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);


        try {
            return ResponseEntity.ok(trackerService.getAllTasks(usrId));
        } catch (Exception e){
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @PostMapping("/doneTasks")
    public ResponseEntity<DtoAction> allDoneTasks(@RequestBody Map<Long, Long> lista , HttpSession session) {
        Long usrId = authorize(session.getAttribute("id"));
        if (usrId<0) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);

        DtoAction action = trackerService.updateAllDoneTasks(lista, usrId);
        if (action != null) {
            return ResponseEntity.ok(action);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
        /*
        try {
            return ResponseEntity.ok(trackerService.updateAllDoneTasks(lista, usrId));
        } catch (Exception e){
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }*/
    }

    @PutMapping("/newComments")
    public ResponseEntity<List<DtoAnimal>> addNewComments(@RequestBody Map<Long, List<String>> comments , HttpSession session) {
        Long usrId = authorize(session.getAttribute("id"));
        if (usrId<0) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);

        try {
            return ResponseEntity.ok(trackerService.updateNewComments(comments, usrId));
        } catch (Exception e){
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @PutMapping("/actionComments")
    public ResponseEntity<DtoAction> addNewCommentsOnAction(@RequestBody List<String> commentsAction , HttpSession session) {
        Long usrId = authorize(session.getAttribute("id"));
        if (usrId<0) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
        System.out.println("controller:");
        System.out.println(commentsAction);
        try {
            return ResponseEntity.ok(trackerService.updateNewCommentsOnAction(commentsAction, usrId));
        } catch (Exception e){
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }
}
