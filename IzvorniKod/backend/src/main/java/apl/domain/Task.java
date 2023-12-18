package apl.domain;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Task {

    @Id
    @GeneratedValue
    private Long id;

    private LocalDateTime startOfTask;

    private LocalDateTime endOfTask;

    private Long latStart;

    private Long latFinish;

    private Long lonStart;

    private Long lonFinish;

    private String content;

    private Boolean status;

    private  String title;

    @OneToMany
    private List<TaskComment> comments;
}