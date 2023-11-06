package apl.domain;

import jakarta.persistence.Column;
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
public class Manager {
    public Manager(Long id, @NotNull Long stationId) {
        this.id = id;
        this.stationId = stationId;
    }

    public Manager() {
    }

    @Id
    private Long id;

    private boolean approved = false;

    @NotNull
    @Column(unique = true)
    private Long stationId;
}
