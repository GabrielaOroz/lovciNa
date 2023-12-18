package apl.domain;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@AllArgsConstructor
public class AnimalHistory {

    public AnimalHistory(Long id) {
        this.id = id;
    }

    @Id
    private Long id;

    private LocalDateTime time;

    private Long longitude;

    private Long latitude;

}
