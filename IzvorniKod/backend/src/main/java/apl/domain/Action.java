package apl.domain;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToMany;
import lombok.*;
import org.jetbrains.annotations.NotNull;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class Action {

    @Id
    @GeneratedValue
    private Long id;

    private Long managerId;

    private Long researcherId;

    private String title;

    private LocalDateTime startOfAction;

    private LocalDateTime endOfAction;

    @NotNull
    private Boolean status = false;

}
