package apl.domain;

import apl.converters.ConvertibleToDTO;
import apl.converters.MyConverter;
import apl.dto.*;
import apl.entityWrapper.EntityWrapper;
import apl.enums.TaskStatus;
import apl.filter.LazyFieldsFilter;
import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.jetbrains.annotations.NotNull;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.LinkedList;
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
        scope = Task.class)
public class Task implements ConvertibleToDTO<DtoTask> {



    @Override
    public DtoTask toDTO() {
        if (this.id==null) return null;
        Set<EntityWrapper> entities = new HashSet<>();
        entities.add(new EntityWrapper(this.getClass(), this.id));
        DtoTask task = new DtoTask();
        task.setId(this.id);
        if (this.tracker!=null) task.setTracker(this.tracker.toTrackerDTO(entities));
        if (this.action!=null) task.setAction(this.action.toDTO(entities));
        if (this.route!=null) task.setRoute(this.route.toDTO(entities));
        task.setStartOfTask(this.startOfTask);
        task.setEndOfTask(this.endOfTask);
        task.setLongitude(this.longitude);
        task.setLatitude(this.latitude);
        task.setLonStart(this.lonStart);
        task.setLonFinish(this.lonFinish);
        task.setLatStart(this.latStart);
        task.setLatFinish(this.latFinish);
        task.setTitle(this.title);
        task.setContent(this.content);
        task.setStatus(this.status);
        return task;
    }

    DtoTask toDTO(Set<EntityWrapper> entities) {
        if (this.id==null) return null;
        Set<EntityWrapper> localEntities = new HashSet<>(entities);
        EntityWrapper thEntity = new EntityWrapper(this.getClass(), this.id);
        if (localEntities.contains(thEntity)) return null;
        localEntities.add(thEntity);
        DtoTask task = new DtoTask();
        task.setId(this.id);
        if (this.tracker!=null) task.setTracker(this.tracker.toTrackerDTO(localEntities));
        if (this.action!=null) task.setAction(this.action.toDTO(localEntities));
        if (this.route!=null) task.setRoute(this.route.toDTO(localEntities));
        task.setStartOfTask(this.startOfTask);
        task.setEndOfTask(this.endOfTask);
        task.setLongitude(this.longitude);
        task.setLatitude(this.latitude);
        task.setLonStart(this.lonStart);
        task.setLonFinish(this.lonFinish);
        task.setLatStart(this.latStart);
        task.setLatFinish(this.latFinish);
        task.setTitle(this.title);
        task.setContent(this.content);
        task.setStatus(this.status);
        return task;
    }

    @Id
    @GeneratedValue
    private Long id;

    @ManyToOne(cascade = {CascadeType.PERSIST, CascadeType.MERGE, CascadeType.REFRESH}, optional = false)
    @JoinColumn(name = "tracker_id")
    private Tracker tracker;

    public void assignTracker(Tracker tracker) {
        this.tracker=tracker;
        tracker.getTasks().add(this);
    }

    public DtoTracker retrieveTrackerDTO() {
        if (this.tracker==null) return null;
        return this.tracker.toTrackerDTO();
    }

    @ManyToOne(cascade = {CascadeType.PERSIST, CascadeType.MERGE, CascadeType.REFRESH}, optional = false)
    @JoinColumn(name = "action_id")
    private Action action;

    public void assignAction(Action action) {
        this.action=action;
        action.getTasks().add(this);
    }

    public DtoAction retrieveActionDTO() {
        if (this.action==null) return null;
        return this.action.toDTO();
    }

    @ManyToOne(cascade = {CascadeType.PERSIST, CascadeType.MERGE, CascadeType.REFRESH})
    @JoinColumn(name = "route_id")
    private Route route;

    public void assignRoute(Route route) {
        this.route=route;
        route.getTasks().add(this);
    }

    public DtoRoute retrieveRouteDTO() {
        if (this.route==null) return null;
        return this.route.toDTO();
    }

    @JsonInclude(value = JsonInclude.Include.CUSTOM, valueFilter = LazyFieldsFilter.class)
    @ManyToMany(cascade = {CascadeType.PERSIST, CascadeType.MERGE, CascadeType.REFRESH})
    @JoinTable(name = "task_animal",
            joinColumns = { @JoinColumn(name = "task_id") },
            inverseJoinColumns = { @JoinColumn(name = "animal_id") })
    private List<Animal> animals = new LinkedList<>();

    public void addAnimal(Animal animal) {
        this.animals.add(animal);
        animal.getTasks().add(this);
    }

    public void addMultipleAnimals(List<Animal> animals) {
        for (Animal animal:animals) addAnimal(animal);
    }


    public List<DtoAnimal> retrieveAnimalsDTO() {
        return MyConverter.convertToDTOList(this.animals);
    }

    @Column(nullable = false)
    private LocalDateTime startOfTask = LocalDateTime.now();

    private LocalDateTime endOfTask;

    private Double longitude;

    private Double latitude;

    private Double lonStart;

    private Double lonFinish;

    private Double latStart;

    private Double latFinish;

    private String title;

    private String content;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private TaskStatus status = TaskStatus.ACTIVE;


    @JsonInclude(value = JsonInclude.Include.CUSTOM, valueFilter = LazyFieldsFilter.class)
    @OneToMany(mappedBy = "task", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("creationTime ASC")
    private List<TaskComment> comments = new LinkedList<>();


    public void addComment(TaskComment comment) {
        this.comments.add(comment);
        comment.setTask(this);
    }

    public void addMultipleComments(List<TaskComment> comments) {
        for (TaskComment comment:comments) addComment(comment);
    }

    public List<DtoTaskComment> retrieveCommentsDTO() {
        return MyConverter.convertToDTOList(this.comments);
    }

}