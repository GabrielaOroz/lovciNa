package apl.domain;

import apl.converters.ConvertibleToDTO;
import apl.converters.ConvertibleToLocation;
import apl.converters.MyConverter;
import apl.dto.*;
import apl.entityWrapper.EntityWrapper;
import apl.filter.LazyFieldsFilter;
import apl.location.Location;
import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

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
        scope = Animal.class)
public class Animal implements ConvertibleToDTO<DtoAnimal>, ConvertibleToLocation {

    public Animal(Species species, String name, String description, byte[] photo) {
        assignSpecies(species);
        setName(name);
        setDescription(description);
        setPhoto(photo);
    }



    @Override
    public DtoAnimal toDTO() {
        if (this.id==null) return null;
        Set<EntityWrapper> entities = new HashSet<>();
        entities.add(new EntityWrapper(this.getClass(), this.id));
        DtoAnimal animal = new DtoAnimal();
        animal.setId(this.id);
        if (this.species!=null) animal.setSpecies(this.species.toDTO(entities));
        animal.setPhoto(this.photo);
        animal.setName(this.name);
        animal.setDescription(this.description);
        animal.setLongitude(this.longitude);
        animal.setLatitude(this.latitude);
        return animal;
    }

    DtoAnimal toDTO(Set<EntityWrapper> entities) {
        if (this.id==null) return null;
        Set<EntityWrapper> localEntities = new HashSet<>(entities);
        EntityWrapper thEntity = new EntityWrapper(this.getClass(), this.id);
        if (localEntities.contains(thEntity)) return null;
        localEntities.add(thEntity);
        DtoAnimal animal = new DtoAnimal();
        animal.setId(this.id);
        if (this.species!=null) animal.setSpecies(this.species.toDTO(localEntities));
        animal.setPhoto(this.photo);
        animal.setName(this.name);
        animal.setDescription(this.description);
        animal.setLongitude(this.longitude);
        animal.setLatitude(this.latitude);
        return animal;
    }

    public void updateLocation(Double longitude, Double latitude) {
        this.longitude=longitude;
        this.latitude=latitude;
    }


    @Override
    public Location toLocation() {
        return new Location(this.longitude, this.latitude);
    }


    @Id
    @GeneratedValue
    private Long id;

    @ManyToOne(cascade = {CascadeType.PERSIST, CascadeType.MERGE, CascadeType.REFRESH})
    @JoinColumn(name = "species_id")
    private Species species;

    public void assignSpecies(Species species) {
        this.species=species;
        species.getAnimals().add(this);
    }


    public DtoSpecies retrieveSpeciesDTO() {
        if (this.species==null) return null;
        return this.species.toDTO();
    }

    private String name;

    @JsonIgnore
    private byte[] photo;

    private String description;

    private Double longitude;

    private Double latitude;

    @JsonInclude(value = JsonInclude.Include.CUSTOM, valueFilter = LazyFieldsFilter.class)
    @OneToMany(mappedBy = "animal", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("creationTime ASC")
    private List<AnimalComment> comments = new LinkedList<>();

    public void addComment(AnimalComment comment) {
        this.comments.add(comment);
        comment.setAnimal(this);
    }

    public void addMultipleComments(List<AnimalComment> comments) {
        for (AnimalComment comment:comments) addComment(comment);
    }

    public List<DtoAnimalComment> retrieveCommentsDTO() {
        return MyConverter.convertToDTOList(this.comments);
    }

    @JsonInclude(value = JsonInclude.Include.CUSTOM, valueFilter = LazyFieldsFilter.class)
    @OneToMany(mappedBy = "animal", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("time ASC")
    private List<AnimalHistory> history = new LinkedList<>();

    public void addLocation (AnimalHistory location) {
        this.history.add(location);
        location.setAnimal(this);
    }

    public void addMultipleLocations(List<AnimalHistory> locations) {
        for (AnimalHistory location:locations) addLocation(location);
    }

    public List<DtoAnimalHistory> retrieveHistoryDTO() {
        return MyConverter.convertToDTOList(this.history);
    }

    @JsonInclude(value = JsonInclude.Include.CUSTOM, valueFilter = LazyFieldsFilter.class)
    @ManyToMany(cascade = {CascadeType.PERSIST, CascadeType.MERGE, CascadeType.REFRESH}, mappedBy = "animals")
    private List<Action> actions = new LinkedList<>();

    public void addAction(Action action) {
        this.actions.add(action);
        action.getAnimals().add(this);
    }

    public void addMultipleActions(List<Action> actions) {
        for (Action action:actions) addAction(action);
    }

    public List<DtoAction> retrieveActionsDTO() {
        return MyConverter.convertToDTOList(this.actions);
    }

    @JsonInclude(value = JsonInclude.Include.CUSTOM, valueFilter = LazyFieldsFilter.class)
    @ManyToMany(cascade = {CascadeType.PERSIST, CascadeType.MERGE, CascadeType.REFRESH}, mappedBy = "animals")
    @OrderBy("startOfTask ASC")
    private List<Task> tasks = new LinkedList<>();

    public void addTask(Task task) {
        this.tasks.add(task);
        task.getAnimals().add(this);
    }

    public void addMultipleTasks(List<Task> tasks) {
        for (Task task:tasks) addTask(task);
    }

    public List<DtoTask> retrieveTasksDTO() {
        return MyConverter.convertToDTOList(this.tasks);
    }

    @JsonIgnore
    @Transient
    private transient boolean includePhoto = false;
}
