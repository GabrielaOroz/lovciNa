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

    //public UserController(UserService userService) {
     //   this.userService = userService;
    //}


    @GetMapping("/admin") //kad dođe GET zahtjev, on će se spojit ovdje i pozvati metodu deklariranu u userService
    public List<User> listUsers() {
        return userService.listAll();
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
                // You can save the profile photo to a file or database here
            } catch (IOException e) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error processing profile photo");
            }
        }

        userService.createUser(user);
        System.out.println("registrirao novog usera");
        return ResponseEntity.ok("Data received and processed");
    }

    @PostMapping("/login")       //post, get ?
    public ResponseEntity<String> logInUser(@RequestBody LogInDTO user){
        userService.logInUser(user);
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
