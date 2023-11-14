package apl.domain;

import com.sun.mail.iap.ByteArray;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import org.jetbrains.annotations.NotNull;


@Entity
@Getter
@Setter
@ToString
@Inheritance(strategy = InheritanceType.JOINED)
@Table(name = "my_user")
public class User {


    private static final String EMAIL_REGEX = "^\\w+([.-]?\\w+)*@\\w+([.-]?\\w+)*(\\.\\w{2,3})+$";
    private static final String NAME_REGEX = "^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$";
    private static final String SURNAME_REGEX = "^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$";
    private static final String USERNAME_REGEX = "^\\w+$";

    public User() {
    }

    public User(@NotNull String username, @NotNull String role, byte[] photo, @NotNull String password, @NotNull String name, @NotNull String surname, @NotNull String email) {
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
    private String username;

    @NotNull
    private String role;

    @Column(name = "photo", columnDefinition = "bytea")
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

    @PrePersist
    @PreUpdate
    private void beforeSaveOrUpdate() {
        validateEmail();
        validateName();
        validateSurname();
        validateUsername();
    }

    private void validateEmail() {
        if (!email.matches(EMAIL_REGEX)) {
            throw new IllegalStateException("Invalid email format");
        }
    }

    private void validateName() {
        if (!name.matches(NAME_REGEX)) {
            throw new IllegalStateException("Invalid name format");
        }
    }

    private void validateSurname() {
        if (!surname.matches(SURNAME_REGEX)) {
            throw new IllegalStateException("Invalid surname format");
        }
    }

    private void validateUsername() {
        if (!username.matches(USERNAME_REGEX)) {
            throw new IllegalStateException("Invalid username format");
        }
    }
}
