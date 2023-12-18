package apl.domain;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
public class Habitat {

    @Id
    @GeneratedValue
    private Long id;

    private Long longitude;

    private Long latitude;

    private String description;

    private String name;

    private byte[] photo;
}
