package apl.domain;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Animal {

    @Id
    @GeneratedValue
    private Long id;

    @ManyToOne
    private Species species;

    private byte[] photo;

    private String description;

    private Long longitude;

    private Long latitude;

    @OneToMany
    private List<AnimalComment> comments;
}
