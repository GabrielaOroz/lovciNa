package apl.domain;

import jakarta.persistence.*;

@Entity
@Table(name = "my_user")
public class User {

    @Id
    private Long id;

    private String username;

    private String photo;

    private String password;

    private String name;

    private String surname;
    private String email;

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
