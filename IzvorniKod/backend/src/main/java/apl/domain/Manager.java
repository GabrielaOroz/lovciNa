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
public class Manager extends User {
    public Manager(User user) {
        this.setId(user.getId());
        this.setUsername(user.getUsername());
        this.setRole(user.getRole());
        this.setPhoto(user.getPhoto());
        this.setPassword(user.getPassword());
        this.setName(user.getName());
        this.setSurname(user.getSurname());
        this.setEmail(user.getEmail());
    }

    public Manager() {
    }

    private boolean approved = false;

    //@NotNull
    @OneToOne
    private Station station;
}
