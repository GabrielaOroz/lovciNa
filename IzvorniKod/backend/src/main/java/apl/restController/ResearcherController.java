package apl.restController;

import apl.dao.ResearcherRepository;
import apl.domain.*;
import apl.service.ResearcherService;
import jakarta.servlet.http.HttpSession;
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
    ResearcherService researcherService;
    @Autowired
    private ResearcherRepository researcherRepo;

    private Long authorize1(Object idObj) {
        if (idObj instanceof Long) {
            Long id = (Long) idObj;
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
        if (idObj instanceof Long) {
            Long id = (Long) idObj;
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
    public ResponseEntity<String> createAction(@RequestBody ActionDTO actionDTO, HttpSession session){

        Action action = new Action();
        action.setManagerId(actionDTO.getManagerId());
        action.setResearcherId(actionDTO.getResearcherId());
        action.setTitle(actionDTO.getTitle());


        List<TrackerRequirement> newReq = new ArrayList<>();

        for (RequirementDTO req : actionDTO.getRequirements()){

            TrackerRequirement requirement = new TrackerRequirement();

            requirement.setAmount(req.getAmount());
            requirement.setMediumType(req.getMediumType());
            requirement.setActionId(action.getId());

            newReq.add(requirement);

        }


        int created = researcherService.createAction(action, newReq);

        if(created == 1){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("This researcher already has its action.");
        } else if(created == -1){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Data nije dobar");
        }

        return ResponseEntity.ok("Action created successfully");
    }

    @GetMapping("/managers")
    public ResponseEntity<List<Manager>> getManagers(HttpSession session){
        if (researcherService.listAllManagers() != null) {
            return ResponseEntity.ok(researcherService.listAllManagers());
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(researcherService.listAllManagers());
        }
    }
}
