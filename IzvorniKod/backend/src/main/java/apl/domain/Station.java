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
public class Station {
    public Station(@NotNull String name, String description) {
        this.name = name;
        this.description = description;
    }

    @Id
    @GeneratedValue
    private Long id;

    @NotNull
    private String name;

    private String description;
}
