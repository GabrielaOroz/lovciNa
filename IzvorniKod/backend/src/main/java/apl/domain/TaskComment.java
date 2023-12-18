package apl.domain;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class TaskComment {

    @Id
    @GeneratedValue
    private Long id;

    @OneToOne
    private User user;

    @ManyToOne
    private Task task;

    private String title;

    private String content;
}
