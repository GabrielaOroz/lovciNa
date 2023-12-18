package apl.restController;

import apl.dao.*;
import apl.domain.*;
import apl.service.UserService;

import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;


import java.io.IOException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

//ovdje se definira reakcija app na http zahtjeve

@CrossOrigin(
        origins = "http://localhost:5173",
        methods  = { RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE },
        allowedHeaders = "*",
        allowCredentials = "true"
)
@RestController                 //kažemo da je to komponenta koju treba pospojit i to controller
@RequestMapping("/auth")       //svi url koji ovako počinju će se tu ispitati
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private UserRepository userRepo;
    @Autowired
    private ManagerRepository managerRepo;
    @Autowired
    private ResearcherRepository researcherRepo;
    @Autowired
    private StationRepository stationRepo;
    @Autowired
    private TrackerRepository trackerRepo;

    public UserController() {
    }

    private Long authorize1(Object idObj) {
        if (idObj instanceof Long) {
            Long id = (Long) idObj;
            User user=userRepo.findById(id).orElse(null);
            if (user==null) return -1L;
            if (user.isRegistered()) return id;
        }
        return -1L;
    }

    private Long authorize2(Object idObj) {
        if (idObj instanceof Long) {
            Long id = (Long) idObj;
            User user=userRepo.findById(id).orElse(null);
            if (user==null) return -1L;
            if (!user.isRegistered()) return -1L;
            if (user.getRole().equals("tracker")) return id;
            if (user.getRole().equals("manager")) {
                Manager manager=managerRepo.findById(id).orElse(null);
                if (manager.isApproved()) return id;
            }
            else if (user.getRole().equals("researcher")) {
                Researcher researcher=researcherRepo.findById(id).orElse(null);
                if (researcher.isApproved()) return id;
            }
        }
        return -1L;
    }

    @PostMapping("/register")    //kad dođe POST zahtjev, napravi sljedeće, zapravo REGISTRIRAJ
    public ResponseEntity<String> createUser(
            @RequestParam("role") String role,
            @RequestParam("firstName") String firstname,
            @RequestParam("lastName") String lastname ,
            @RequestPart("selectedFile") MultipartFile selectedFile,
            @RequestParam("email") String email,
            @RequestParam("username") String username,
            @RequestParam("password") String password
            //@RequestParam(name = "stationId", required = false) Long stationId
            ) {
        User user = new User();
        user.setRole(role);
        user.setName(firstname);
        user.setSurname(lastname);
        user.setEmail(email);
        user.setUsername(username);
        user.setPassword(password);

        if (selectedFile != null) {
            try {
                user.setPhoto(selectedFile.getBytes());
            } catch (IOException e) {
                System.out.println("Error processing profile photo");
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error processing profile photo");
            }
        }
        else return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Photo not sent");

        int status = userService.createUser(user);
        if (status==-1) return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Data not valid");

        if (status==1) return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("User with email " + user.getEmail() + " and username " + user.getUsername() + "already exists!");
        if (status==2) return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("User with email " + user.getEmail() + "already exists!");
        if (status==3) return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("User with username " + user.getUsername() + "already exists!");


        if (status!=0) {
            System.out.println("Error on server");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error on server");
        }

        return ResponseEntity.ok("Register successful");
    }

    @PostMapping("/login")
    public ResponseEntity<String> logInUser(@RequestBody LogInDTO user, HttpSession session){
        int res = userService.logInUser(user);
        if(res == -1) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User doesn't exist!");
        } else if(res == -2) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Please confirm your email!");
        } else if (res == -3) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Incorrect username or password");
        }
        User usr=userRepo.findByUsername(user.getUsername()).orElse(null);
        session.setAttribute("id", usr.getId());
        //System.out.println((Long) session.getAttribute("id"));
        return ResponseEntity.ok("Data received and processed");
    }

    @PostMapping("/logout")
    public ResponseEntity<String> logout(HttpSession session) {
        if (session != null) {
            session.invalidate();
            return ResponseEntity.ok("Logout successful");
        } else {
            return ResponseEntity.ok("No active session to logout from");
        }
    }

    @GetMapping("/expired")
    public ResponseEntity<String> expiredToken(){
        return ResponseEntity.ok("Data received and processed");
    }

    @GetMapping(path = "/confirm")
    public ResponseEntity<String> confirm(@RequestParam("token") String token,
                                          RedirectAttributes redirectAttributes) {

        String result = userService.confirmToken(token);

        redirectAttributes.addFlashAttribute("confirmationMessage", result);

        // Check the result and return an appropriate response
        switch (result) {
            case "confirmed":
                try {
                    return ResponseEntity.status(HttpStatus.FOUND)
                            .location(new URI("http://localhost:5173/login"))
                            .build();
                } catch (URISyntaxException e) {
                    return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Internal Server Error");
                }
            case "token_not_found":
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Token not found");
            case "email_already_confirmed":
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Email already confirmed");
            case "token_expired":
                try {
                    // Redirect to the specified URL on success
                    return ResponseEntity.status(HttpStatus.FOUND)
                            .location(new URI("http://localhost:5173/expired"))
                            .build();
                } catch (URISyntaxException e) {
                    // Handle the exception if the URI is invalid
                    return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Internal Server Error");
                }
                //return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Token expired");
            default:
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Unknown error");
        }
    }

    @GetMapping("/current-user")
    public ResponseEntity<Map<String, Object>> getData(HttpSession session) {
        Map<String, Object> data = new HashMap<>();

        if (session.getAttribute("admin") instanceof Boolean) data.put("admin", true);
        else data.put("admin", false);

        Long usrId=authorize1(session.getAttribute("id"));
        if (usrId<0) return ResponseEntity.ok(data);
        User user=userRepo.findById(usrId).orElse(null);

        data.put("id", usrId);
        data.put("username", user.getUsername());
        if (user.getRole().equals("tracker")) {
            data.put("role", "tracker");
            Tracker tracker=trackerRepo.findById(usrId).orElse(null);
            //data.put("stationId",tracker.getStationId());
        }
        else if (user.getRole().equals("manager")) {
            data.put("role", "manager");
            Manager manager=managerRepo.findById(usrId).orElse(null);
            //data.put("stationId",manager.getStationId());
            data.put("approved",manager.isApproved());
        }
        else if (user.getRole().equals("researcher")) {
            data.put("role", "researcher");
            Researcher researcher=researcherRepo.findById(usrId).orElse(null);
            data.put("approved",researcher.isApproved());
        }
        else return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);

        return ResponseEntity.ok(data);
    }
}
