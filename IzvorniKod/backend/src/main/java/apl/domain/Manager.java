package apl.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import org.jetbrains.annotations.NotNull;

@Entity
public class Manager {
    public Manager(Long id, @NotNull Long stationId) {
        this.id = id;
        this.stationId = stationId;
    }

    public Manager() {
    }

    @Id
    private Long id;

    @NotNull
    private boolean approved;

    @NotNull
    @Column(unique = true)
    private Long stationId;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    @Override
    public String toString() {
        return "Manager{" +
                "id=" + id +
                ", approved=" + approved +
                ", stationId=" + stationId +
                '}';
    }
}
