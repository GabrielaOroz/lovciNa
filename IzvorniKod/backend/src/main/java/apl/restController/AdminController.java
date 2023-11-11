package apl.restController;

import apl.domain.AdminLogInDTO;
import apl.domain.User;
import apl.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/auth")
public class AdminController {

    @Autowired
    private UserService userService;

    @GetMapping("/admin") //kad dođe GET zahtjev, on će se spojit ovdje i pozvati metodu deklariranu u userService
    public ResponseEntity<List<User>> listUsers() {
        List<User> listOfUsers = userService.listAll();
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
}
