package apl.rest;

import apl.domain.User;
import apl.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

//ovjde se definira reakcija app na http zahtjeve


@RestController //kažemo da je to komponenta koju treba pospojit
@RequestMapping("/users")   //svi url koji ovako počinju će se tu ispitati
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping("") //kad dođe GET zahtjev, on će se spojit ovdje i pozvati metodu deklariranu u userService
    public List<User> listUsers() {
        return userService.listAll();
    }

    @PostMapping("")    //kad dođe POST zahtjev, napravi sljedeće, zapravo REGISTRIRAJ
    public User createUser(@RequestBody User user) {    //iz RequestBody-ja čitamo podatke koje nam je korisnik upisao(JSON)
        return userService.createUser(user);
    }
}
