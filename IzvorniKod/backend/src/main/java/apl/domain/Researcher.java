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
public class Researcher {
    public Researcher(Long id) {
        this.id = id;
    }

    public Researcher() {
    }

    @Id
    private Long id;

    private boolean approved = false;

}
