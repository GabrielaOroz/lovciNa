package apl.domain;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class RegisteredDTO{

    private Long id;
    private String role;
    private String name;
    private String surname;
    private String username;
    private String email;
    private String password;
    private byte[] photo;
    private boolean approved = true;
}
