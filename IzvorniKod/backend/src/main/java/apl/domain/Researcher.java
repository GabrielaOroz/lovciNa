package apl.domain;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import org.jetbrains.annotations.NotNull;

@Entity
@Getter
@Setter
@ToString
public class Researcher extends User {
    public Researcher(User user) {
        this.setId(user.getId());
        this.setUsername(user.getUsername());
        this.setRole(user.getRole());
        this.setPhoto(user.getPhoto());
        this.setPassword(user.getPassword());
        this.setName(user.getName());
        this.setSurname(user.getSurname());
        this.setEmail(user.getEmail());
    }

    public Researcher() {
    }

    private boolean approved = false;

}
