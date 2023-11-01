package apl.domain;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;

@Entity
public class Manager {
    @Id
    @GeneratedValue
    private Long id;

    private boolean approved;

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
