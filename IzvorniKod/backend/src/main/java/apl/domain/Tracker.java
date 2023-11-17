package apl.domain;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import org.jetbrains.annotations.NotNull;

@Entity
@Getter
@Setter
@ToString
public class Tracker extends User {

    public Tracker(User user, @NotNull Long stationId) {
        this.setId(user.getId());
        this.setUsername(user.getUsername());
        this.setRole(user.getRole());
        this.setPhoto(user.getPhoto());
        this.setPassword(user.getPassword());
        this.setName(user.getName());
        this.setSurname(user.getSurname());
        this.setEmail(user.getEmail());
        this.stationId = stationId;
    }

    public Tracker() {
    }

    @NotNull
    private Long stationId;
}
