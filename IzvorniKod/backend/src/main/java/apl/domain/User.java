package apl.domain;

import jakarta.persistence.*;
import org.jetbrains.annotations.NotNull;
import org.intellij.lang.annotations.Pattern;


@Entity
@Table(name = "my_user")
public class User {

    @Id
    private Long id;

    @NotNull
    @Column(unique = true)
    //@Pattern(regexp = "^[a-zA-Z0-9]+([._]?[a-zA-Z0-9]+)*$", message="")
    private String username;

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

    @NotNull
    private boolean registered;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    @Override
    public String toString() {
        return "User{" +
                "id=" + id +
                ", username='" + username + '\'' +
                ", photo=" + photo +
                ", password='" + password + '\'' +
                ", name='" + name + '\'' +
                ", surname='" + surname + '\'' +
                ", email='" + email + '\'' +
                '}';
    }
}
