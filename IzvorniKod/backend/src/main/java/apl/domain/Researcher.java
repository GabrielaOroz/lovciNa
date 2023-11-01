package apl.domain;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;

@Entity
public class Researcher {

    @Id
    @GeneratedValue
    private Long id;

    private boolean approved;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    @Override
    public String toString() {
        return "Researcher{" +
                "id=" + id +
                ", approved=" + approved +
                '}';
    }
}
