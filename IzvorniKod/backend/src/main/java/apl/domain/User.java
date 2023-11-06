package apl.domain;

import jakarta.persistence.*;
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


    @Id
    @GeneratedValue
    private Long id;

    @NotNull
    @Column(unique = true)
    //@Pattern(regexp = "^[a-zA-Z0-9]+([._]?[a-zA-Z0-9]+)*$", message="")
    private String username;

    private int role;  //1-researcher, 2-manager, 3-tracker

    @NotNull
    private String photo;

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
