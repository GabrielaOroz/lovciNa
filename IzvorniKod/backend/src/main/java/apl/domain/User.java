package apl.domain;

import jakarta.persistence.*;
import org.jetbrains.annotations.NotNull;


@Entity
@Table(name = "my_user")
public class User {


    @Id
    @GeneratedValue
    private Long id;

    @NotNull
    @Column(unique = true)
    //@Pattern(regexp = "^[a-zA-Z0-9]+([._]?[a-zA-Z0-9]+)*$", message="")
    private String username;

    @NotNull
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

    @NotNull
    private boolean registered = false;   //je li potvrdio racun preko maila, prvotno false

    public boolean isRegistered() {
        return registered;
    }

    public Long getId() {
        return id;
    }

    public String getUsername() {
        return username;
    }

    public String getPhoto() {
        return photo;
    }

    public String getPassword() {
        return password;
    }

    public String getName() {
        return name;
    }

    public String getSurname() {
        return surname;
    }

    public String getEmail() {
        return email;
    }

    public int getRole() {
        return role;
    }


    public void setUsername(String username) {
        this.username = username;
    }

    public void setRole(int role) {
        this.role = role;
    }

    public void setPhoto(String photo) {
        this.photo = photo;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setSurname(String surname) {
        this.surname = surname;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public void setRegistered(boolean registered) {
        this.registered = registered;
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
