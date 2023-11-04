package apl.rest;

import apl.domain.User;
import apl.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import javax.xml.crypto.Data;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/users")
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping
    public List<User> listUsers() {
        return userService.listAll();
    }

    @PostMapping("/register")
    public ResponseEntity<String> handleData(@RequestBody User data) {

        System.out.println(data.toString());
        return ResponseEntity.ok("Data received and processed");
    }
}
