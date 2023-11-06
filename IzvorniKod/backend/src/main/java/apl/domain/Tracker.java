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
public class Tracker {

    public Tracker(Long id, @NotNull Long stationId) {
        this.id = id;
        this.stationId = stationId;
    }

    public Tracker() {
    }

    @Id
    private Long id;

    @NotNull
    private Long stationId;
}
