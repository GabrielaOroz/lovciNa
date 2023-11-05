package apl.rest;

import apl.domain.User;
import apl.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.web.bind.annotation.*;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;


import javax.xml.crypto.Data;
import java.util.List;
import java.util.Map;

//ovdje se definira reakcija app na http zahtjeve


@RestController                 //kažemo da je to komponenta koju treba pospojit i to controller
@RequestMapping("/users")       //svi url koji ovako počinju će se tu ispitati
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping("/admin") //kad dođe GET zahtjev, on će se spojit ovdje i pozvati metodu deklariranu u userService
    public List<User> listUsers() {
        return userService.listAll();
    }

    @PostMapping("/register")    //kad dođe POST zahtjev, napravi sljedeće, zapravo REGISTRIRAJ
    public Boolean createUser(@RequestBody User user) {    //iz RequestBody-ja čitamo podatke koje nam je korisnik upisao(JSON)
        userService.createUser(user);
        return true;
    }

    @RequestMapping("/login")       //post, get ?
    public Boolean logInUser(@RequestBody User user){
        return false;
    }



    //@PostMapping("/register")
    //public ResponseEntity<String> handleData(@RequestBody User data) {

    //    System.out.println(data.toString());
     //   return ResponseEntity.ok("Data received and processed");
    //}
}
