package apl.domain;


import apl.converters.ConvertibleToDTO;
import apl.dto.*;
import apl.entityWrapper.EntityWrapper;
import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Entity
@Getter
@Setter
@NoArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonIdentityInfo(
        generator = ObjectIdGenerators.PropertyGenerator.class,
        property = "id",
        scope = TaskComment.class)
public class TaskComment implements ConvertibleToDTO<DtoTaskComment> {

    public TaskComment(Task task, String content) {
        assignTask(task);
        this.content=content;
    }


    @Override
    public DtoTaskComment toDTO() {
        if (this.id==null) return null;
        Set<EntityWrapper> entities = new HashSet<>();
        entities.add(new EntityWrapper(this.getClass(), this.id));
        DtoTaskComment taskComment = new DtoTaskComment();
        taskComment.setId(this.id);
        if (this.task!=null) taskComment.setTask(this.task.toDTO(entities));
        taskComment.setCreationTime(this.creationTime);
        taskComment.setContent(this.content);
        return taskComment;
    }

    DtoTaskComment toDTO(Set<EntityWrapper> entities) {
        if (this.id==null) return null;
        Set<EntityWrapper> localEntities = new HashSet<>(entities);
        EntityWrapper thEntity = new EntityWrapper(this.getClass(), this.id);
        if (localEntities.contains(thEntity)) return null;
        localEntities.add(thEntity);
        DtoTaskComment taskComment = new DtoTaskComment();
        taskComment.setId(this.id);
        if (this.task!=null) taskComment.setTask(this.task.toDTO(localEntities));
        taskComment.setCreationTime(this.creationTime);
        taskComment.setContent(this.content);
        return taskComment;
    }


    @Id
    @GeneratedValue
    private Long id;

    @ManyToOne(cascade = {CascadeType.PERSIST, CascadeType.MERGE, CascadeType.REFRESH}, optional = false)
    @JoinColumn(name = "task_id")
    private Task task;

    public void assignTask(Task task) {
        this.task=task;
        task.getComments().add(this);
    }

    public DtoTask retrieveTaskDTO() {
        if (this.task==null) return null;
        return this.task.toDTO();
    }

    @Column(nullable = false)
    private LocalDateTime creationTime = LocalDateTime.now();

    private String content;

}
