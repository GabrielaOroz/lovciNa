package apl.domain;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import org.jetbrains.annotations.NotNull;

@Entity
public class Researcher {
    public Researcher(Long id) {
        this.id = id;
    }

    public Researcher() {
    }

    @Id
    private Long id;

    @NotNull
    private boolean approved = false;

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
