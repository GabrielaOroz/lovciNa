package apl.domain;

import jakarta.persistence.*;
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

    @ManyToOne
    private Manager manager;

    @ManyToOne
    private Researcher researcher;

    private String title;

    private LocalDateTime startOfAction;

    private LocalDateTime endOfAction;

    @NotNull
    private Boolean status = false;

}
