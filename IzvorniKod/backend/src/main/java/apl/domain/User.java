package apl.domain;

import com.sun.mail.iap.ByteArray;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import org.jetbrains.annotations.NotNull;


@Entity
@Getter
@Setter
@ToString

@Table(name = "my_user")
public class User {

    public User() {
    }

    public User(@NotNull String username, String role, byte[] photo, @NotNull String password, @NotNull String name, @NotNull String surname, @NotNull String email) {
        this.username = username;
        this.role = role;
        this.photo = photo;
        this.password = password;
        this.name = name;
        this.surname = surname;
        this.email = email;
    }

    @Id
    @GeneratedValue
    private Long id;

    @NotNull
    @Column(unique = true)
    //@Pattern(regexp = "^[a-zA-Z0-9]+([._]?[a-zA-Z0-9]+)*$", message="")
    private String username;

    @NotNull
    private String role;  //1-researcher, 2-manager, 3-tracker

    @Lob
    private byte[] photo;

    @NotNull
    private String password;

    @NotNull
    private String name;

    @NotNull
    private String surname;

    @NotNull
    @Column(unique = true)
    private String email;

    private boolean registered = false;   //je li potvrdio racun preko maila, prvotno false

}
