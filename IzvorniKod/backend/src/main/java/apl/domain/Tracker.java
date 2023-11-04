package apl.domain;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import org.jetbrains.annotations.NotNull;

@Entity
public class Tracker {

    @Id
    @GeneratedValue
    private Long id;

    @NotNull
    private Long stationId;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    @Override
    public String toString() {
        return "Tracker{" +
                "id=" + id +
                ", stationId=" + stationId +
                '}';
    }
}
