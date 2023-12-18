package apl.domain;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@AllArgsConstructor
public class AnimalComment {

    @Id
    @GeneratedValue
    private Long id;

    @OneToOne
    private Animal animal;

    @OneToOne
    private User user;

    @ManyToOne
    private Action action;

    private String title;

    private String content;
}
