package apl.restController;

import apl.domain.*;
import apl.service.UserService;
import org.hibernate.mapping.Column;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@CrossOrigin(origins = "https://wildtrackfront.onrender.com")
@RestController
public class AdminController {

    @Autowired
    private UserService userService;


    @GetMapping("/admin/registeredUsers") //kad dođe GET zahtjev, on će se spojit ovdje i pozvati metodu deklariranu u userService
    public ResponseEntity<List<RegisteredDTO>> listUsers() {
        List<RegisteredDTO> listOfUsers = userService.listAllRegistered();
        return ResponseEntity.ok(listOfUsers);
    }
    @PostMapping("/admin")
    public ResponseEntity<String> logInAdmin(@RequestBody AdminLogInDTO admin) {
        int res = userService.logInAdmin(admin.getPassword());
        if (res == 0) {
            return ResponseEntity.ok("Admin page");
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Wrong admin password!");
    }

    @PutMapping("/admin/newInfo")
    public ResponseEntity<String> changeAttributes(@RequestParam("id") Long id,
                                                   @RequestParam("firstName") String firstName,
                                                   @RequestParam("lastName") String lastName ,
                                                   @RequestPart(name ="selectedFile", required = false) MultipartFile selectedFile,
                                                   @RequestParam("email") String email,
                                                   @RequestParam("username") String username,
                                                   @RequestParam(name ="password", required = false) String password
    ) {

        User user = new User();
        user.setId(id);
        user.setName(firstName);
        user.setSurname(lastName);
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
        } else {
            user.setPhoto(null);
        }

        int res = userService.updateUser(user);
        if (res == 0) {
            return ResponseEntity.ok("Changes confirmed!");
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Cannot update user!");
    }

    @PutMapping("/admin/approved")
    public ResponseEntity<String> approveUser(@RequestBody ApprovedDTO approvedDTO) {
        int res = userService.approveUser(approvedDTO);
        if (res == 0) {
            return ResponseEntity.ok("Status changed");
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Cannot change status");

    }
}
