package apl.restController;

import apl.domain.*;
import apl.service.ResearcherService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/researcher")
public class ResearcherController {

    @Autowired
    ResearcherService researcherService;

    @PostMapping("/create-requests")
    public ResponseEntity<String> createAction(@RequestBody ActionDTO actionDTO
            ){

        Action action = new Action();
        action.setManagerId(actionDTO.getManagerId());
        action.setResearcherId(actionDTO.getResearcherId());
        action.setTitle(actionDTO.getTitle());



        List<TrackerRequirement> newReq = new ArrayList<>();

        for (RequirementDTO req : actionDTO.getRequirements()){

            TrackerRequirement requirement = new TrackerRequirement();

            requirement.setAmount(req.getAmount());
            requirement.setMediumType(req.getMediumType());


            newReq.add(requirement);

        }

        action.setRequirements(newReq);
        int created = researcherService.createAction(action);

        if(created == 1){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("This researcher already has its action.");
        } else if(created == -1){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Data nije dobar");
        }

        return ResponseEntity.ok("Action created successfully");
    }

    @GetMapping("/managers")
    public ResponseEntity<List<Manager>> getManagers(){
        if (researcherService.listAllManagers() != null) {
            return ResponseEntity.ok(researcherService.listAllManagers());
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(researcherService.listAllManagers());
        }
    }
}
