package apl.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import org.jetbrains.annotations.NotNull;

import java.util.List;

@Entity
@Getter
@Setter
@ToString
public class Tracker extends User {

    public Tracker(User user) {
        this.setId(user.getId());
        this.setUsername(user.getUsername());
        this.setRole(user.getRole());
        this.setPhoto(user.getPhoto());
        this.setPassword(user.getPassword());
        this.setName(user.getName());
        this.setSurname(user.getSurname());
        this.setEmail(user.getEmail());
        //this.stationId = stationId;
    }

    public Tracker() {
    }

    private Long longitude;

    private Long latitude;

    //@NotNull
    @ManyToOne
    private Station station;

    @OneToMany
    private List<Task> tasks;


}
