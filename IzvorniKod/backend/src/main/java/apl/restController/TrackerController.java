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

        if (trackerService.getTrackerInfo(usrId) != null) {
            return ResponseEntity.ok(trackerService.getTrackerInfo(usrId));         //jel vraca i name i surname?
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }


    @GetMapping("/trackers")
    public ResponseEntity<List<DtoTracker>> allTrackersOnAction(HttpSession session) {
        Long usrId = authorize(session.getAttribute("id"));
        if (usrId<0) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);

        if (trackerService.getAllTrackersOnAction(usrId) != null) {
            return ResponseEntity.ok(trackerService.getAllTrackersOnAction(usrId));
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }

    @GetMapping("/individuals")
    public ResponseEntity<List<DtoAnimal>> allIndividuals(HttpSession session) {
        Long usrId = authorize(session.getAttribute("id"));
        if (usrId<0) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);

        if (trackerService.getAllAnimals(usrId) != null) {
            return ResponseEntity.ok(trackerService.getAllAnimals(usrId));
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }

    @GetMapping("/species")
    public ResponseEntity<List<DtoSpecies>> allSpecies(HttpSession session) {
        Long usrId = authorize(session.getAttribute("id"));
        if (usrId<0) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);

        if (trackerService.getAllSpecies(usrId) != null) {
            return ResponseEntity.ok(trackerService.getAllSpecies(usrId));
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }

    @GetMapping("/habitats")
    public ResponseEntity<List<DtoHabitat>> allHabitats(HttpSession session) {
        Long usrId = authorize(session.getAttribute("id"));
        if (usrId<0) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);

        if (trackerService.getAllHabitats(usrId) != null) {
            return ResponseEntity.ok(trackerService.getAllHabitats(usrId));
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }

    @GetMapping("/tasks")
    public ResponseEntity<List<DtoTask>> allTasks(HttpSession session) {
        Long usrId = authorize(session.getAttribute("id"));
        if (usrId<0) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);

        if (trackerService.getAllTasks(usrId) != null) {
            return ResponseEntity.ok(trackerService.getAllTasks(usrId));
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }

    @PutMapping("/doneTasks")
    public ResponseEntity<DtoAction> allDoneTasks(@RequestBody Map<Long, Long> lista , HttpSession session) {
        Long usrId = authorize(session.getAttribute("id"));
        if (usrId<0) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);

        if (trackerService.updateAllDoneTasks(lista, usrId) != null) {
            return ResponseEntity.ok(trackerService.updateAllDoneTasks(lista, usrId));
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }

    @PutMapping("/newComments")
    public ResponseEntity<List<DtoAnimal>> addNewComments(@RequestBody Map<Long, List<AnimalComment>> comments , HttpSession session) {
        Long usrId = authorize(session.getAttribute("id"));
        if (usrId<0) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);

        if (trackerService.updateNewComments(comments, usrId) != null) {
            return ResponseEntity.ok(trackerService.updateNewComments(comments, usrId));
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }

    @PutMapping("/actionComments")
    public ResponseEntity<DtoAction> addNewCommentsOnAction(@RequestBody List<ActionComment> comments , HttpSession session) {
        Long usrId = authorize(session.getAttribute("id"));
        if (usrId<0) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);

        if (trackerService.updateNewCommentsOnAction(comments, usrId) != null) {
            return ResponseEntity.ok(trackerService.updateNewCommentsOnAction(comments, usrId));
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }
}
