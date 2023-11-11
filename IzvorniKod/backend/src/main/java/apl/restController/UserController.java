package apl.restController;

import apl.domain.LogInDTO;
import apl.domain.User;
import apl.service.UserService;

import jakarta.servlet.http.HttpServletResponse;
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
import java.util.List;

//ovdje se definira reakcija app na http zahtjeve

@CrossOrigin(origins = "http://localhost:5173")
@RestController                 //kažemo da je to komponenta koju treba pospojit i to controller
@RequestMapping("/auth")       //svi url koji ovako počinju će se tu ispitati
public class UserController {

    @Autowired
    private UserService userService;


    /*@GetMapping("/admin") //kad dođe GET zahtjev, on će se spojit ovdje i pozvati metodu deklariranu u userService
    public ResponseEntity<List<User>> listUsers() {
        List<User> listOfUsers = userService.listAll();
        return ResponseEntity.ok(listOfUsers);
    }
    @PostMapping("/admin")
    public ResponseEntity<String> logInAdmin(@RequestBody String adminPass) {
        int res = userService.logInAdmin(adminPass);
        if (res == 0) {
            return ResponseEntity.ok("Admin page");
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Wrong admin password!");
    }*/

    @PostMapping("/register")    //kad dođe POST zahtjev, napravi sljedeće, zapravo REGISTRIRAJ
    public ResponseEntity<String> createUser(
            @RequestParam("role") String role,
            @RequestParam("firstName") String firstname,
            @RequestParam("lastName") String lastname ,
            @RequestPart("selectedFile") MultipartFile selectedFile,
            @RequestParam("email") String email,
            @RequestParam("username") String username,
            @RequestParam("password") String password,
            @RequestParam(name = "stationId", required = false) Long stationId
            ) {
        User user = new User();
        user.setRole(role);
        user.setName(firstname);
        user.setSurname(lastname);
        user.setEmail(email);
        user.setUsername(username);
        user.setPassword(password);

        if (user.getRole().equals("tracker") || user.getRole().equals("manager")) stationId=0L;
        else if (user.getRole().equals("researcher")) stationId=null;
        else return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Non-existent role");

        if (selectedFile != null) {
            try {
                user.setPhoto(selectedFile.getBytes());
                // You can save the profile photo to a file or database here
            } catch (IOException e) {
                System.out.println("Error processing profile phot");
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error processing profile photo");
            }
        }
        else return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Photo not sent");

        int status=userService.createUser(user,stationId);
        System.out.println("status  "+status);
        if (status==-1) return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Data not valid");

        if (status==1) return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("User with email " + user.getEmail() + " and username " + user.getUsername() + "already exists!");
        if (status==2) return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("User with email " + user.getEmail() + "already exists!");
        if (status==3) return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("User with username " + user.getUsername() + "already exists!");


        if (status!=0) {
            System.out.println("Error on server");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error on server");
        }

        System.out.println("registrirao novog usera");
        return ResponseEntity.ok("Register successful");
    }

    @PostMapping("/login")       //post, get ?
    public ResponseEntity<String> logInUser(@RequestBody LogInDTO user){
        int res = userService.logInUser(user);
        if(res == -1) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User doesn't exist!");
        } else if(res == -2) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Please confirm your email!");
        } else if (res == -3) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Incorrect username or password");
        }
        return ResponseEntity.ok("Data received and processed");
    }


    @GetMapping(path = "/confirm")
    public void confirm(@RequestParam("token") String token, HttpServletResponse response, RedirectAttributes redirectAttributes) {
        // Call the confirmToken method from your userService
        String result = userService.confirmToken(token);

        // Add flash attribute
        redirectAttributes.addFlashAttribute("confirmationMessage", result);

        // Set status to HTTP 302
        response.setStatus(HttpServletResponse.SC_FOUND);

        // Set location header directly
        response.setHeader("Location", "http://localhost:5173/login");
    }
}
