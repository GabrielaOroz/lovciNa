package apl.domain;

import apl.converters.ConvertibleToDTO;
import apl.converters.MyConverter;
import apl.dto.*;
import apl.entityWrapper.EntityWrapper;
import apl.enums.ActionStatus;
import apl.enums.MediumType;
import apl.filter.LazyFieldsFilter;
import apl.location.Location;
import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.Hibernate;
import org.hibernate.annotations.Fetch;
import org.hibernate.annotations.FetchMode;
import org.jetbrains.annotations.NotNull;

//import java.lang.reflect.Field;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

import com.fasterxml.jackson.annotation.JsonInclude;

import static apl.utilities.TimeChecker.isWithinTimeRange;


@Entity
@Getter
@Setter
@ToString
@NoArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonIdentityInfo(
        generator = ObjectIdGenerators.PropertyGenerator.class,
        property = "id",
        scope = Action.class)
public class Action implements ConvertibleToDTO<DtoAction> {

    public Action(Manager manager, Researcher researcher, String title, Map<MediumType, Long> requirements) {
        assignManager(manager);
        assignResearcher(researcher);
        setTitle(title);
        setRequirements(requirements);
    }



    @Override
    public DtoAction toDTO() {
        if (this.id==null) return null;
        Set<EntityWrapper> entities = new HashSet<>();
        entities.add(new EntityWrapper(this.getClass(), this.id));
        DtoAction action=new DtoAction();
        action.setId(this.id);
        if (this.manager!=null) action.setManager(this.manager.toManagerDTO(entities));
        if (this.researcher!=null) action.setResearcher(this.researcher.toResearcherDTO(entities));
        action.setTitle(this.title);
        action.setStartOfAction(this.startOfAction);
        action.setEndOfAction(this.endOfAction);
        action.setStatus(this.status);
        action.setRequirements(this.requirements);
        return action;
    }

    DtoAction toDTO(Set<EntityWrapper> entities) {
        if (this.id==null) return null;
        Set<EntityWrapper> localEntities = new HashSet<>(entities);
        EntityWrapper thEntity = new EntityWrapper(this.getClass(), this.id);
        if (localEntities.contains(thEntity)) return null;
        localEntities.add(thEntity);
        DtoAction action=new DtoAction();
        action.setId(this.id);
        if (this.manager!=null) action.setManager(this.manager.toManagerDTO(localEntities));
        if (this.researcher!=null) action.setResearcher(this.researcher.toResearcherDTO(localEntities));
        action.setTitle(this.title);
        action.setStartOfAction(this.startOfAction);
        action.setEndOfAction(this.endOfAction);
        action.setStatus(this.status);
        action.setRequirements(this.requirements);
        return action;
    }


    @Id
    @GeneratedValue
    private Long id;

    @ManyToOne(cascade = {CascadeType.PERSIST, CascadeType.MERGE, CascadeType.REFRESH}, optional = false)
    @JoinColumn(name = "manager_id")
    private Manager manager;

    public void assignManager(Manager manager) {
        this.manager=manager;
        manager.getActions().add(this);
    }

    public DtoManager retrieveManagerDTO() {
        if (this.manager==null) return null;
        return this.manager.toManagerDTO();
    }

    @ManyToOne(cascade = {CascadeType.PERSIST, CascadeType.MERGE, CascadeType.REFRESH}, optional = false)
    @JoinColumn(name = "researcher_id")
    private Researcher researcher;

    public void assignResearcher(Researcher researcher) {
        this.researcher=researcher;
        researcher.getActions().add(this);
    }

    public DtoResearcher retrieveResearcherDTO() {
        if (this.researcher==null) return null;
        return this.researcher.toResearcherDTO();
    }

    private String title;

    private LocalDateTime startOfAction;

    private LocalDateTime endOfAction;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private ActionStatus status = ActionStatus.PENDING;

    @JsonInclude(value = JsonInclude.Include.CUSTOM, valueFilter = LazyFieldsFilter.class)
    @ElementCollection
    @Fetch(FetchMode.JOIN)
    @CollectionTable(name = "requirements", joinColumns = @JoinColumn(name = "action_id"))
    @MapKeyEnumerated(EnumType.STRING) // Assuming MediumType is an enum
    @Column(name = "value")
    private Map<MediumType, Long> requirements = new HashMap<>();

    @JsonInclude(value = JsonInclude.Include.CUSTOM, valueFilter = LazyFieldsFilter.class)
    @OneToMany(mappedBy = "action", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("startOfTask ASC")
    private List<Task> tasks = new LinkedList<>();


    public void addTask(Task task) {
        this.tasks.add(task);
        task.setAction(this);
    }

    public void addMultipleTasks(List<Task> tasks) {
        for (Task task:tasks) addTask(task);
    }

    public List<DtoTask> retrieveTasksDTO() {
        return MyConverter.convertToDTOList(this.tasks);
    }

    @JsonInclude(value = JsonInclude.Include.CUSTOM, valueFilter = LazyFieldsFilter.class)
    @OneToMany(mappedBy = "action", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("creationTime ASC")
    private List<ActionComment> actionComments = new LinkedList<>();

    public void addActionComment (ActionComment actionComment) {
        this.actionComments.add(actionComment);
        actionComment.setAction(this);
    }

    public void addMultipleActionComments(List<ActionComment> actionComments) {
        for (ActionComment actionComment:actionComments) addActionComment(actionComment);
    }

    public List<DtoActionComment> retrieveActionCommentsDTO() {
        return MyConverter.convertToDTOList(this.actionComments);
    }


    @JsonInclude(value = JsonInclude.Include.CUSTOM, valueFilter = LazyFieldsFilter.class)
    @OneToMany(mappedBy = "action", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("creationTime ASC")
    private List<AnimalComment> animalComments = new LinkedList<>();

    public void addAnimalComment (AnimalComment animalComment) {
        this.animalComments.add(animalComment);
        animalComment.setAction(this);
    }

    public void addMultipleAnimalComments(List<AnimalComment> animalComments) {
        for (AnimalComment animalComment:animalComments) addAnimalComment(animalComment);
    }


    public List<DtoAnimalComment> retrieveAnimalCommentsDTO() {
        return MyConverter.convertToDTOList(this.animalComments);
    }

    @JsonInclude(value = JsonInclude.Include.CUSTOM, valueFilter = LazyFieldsFilter.class)
    @OneToMany(mappedBy = "action", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("creationTime ASC")
    private List<Request> requests = new LinkedList<>();

    public void addRequest (Request request) {
        this.requests.add(request);
        request.setAction(this);
    }

    public void addMultipleRequests(List<Request> requests) {
        for (Request request:requests) addRequest(request);
    }

    public List<DtoRequest> retrieveRequestsDTO() {
        return MyConverter.convertToDTOList(this.requests);
    }


    @JsonInclude(value = JsonInclude.Include.CUSTOM, valueFilter = LazyFieldsFilter.class)
    @ManyToMany(cascade = {CascadeType.PERSIST, CascadeType.MERGE, CascadeType.REFRESH})
    @JoinTable(name = "action_habitat",
            joinColumns = { @JoinColumn(name = "action_id") },
            inverseJoinColumns = { @JoinColumn(name = "habitat_id") })
    private List<Habitat> habitats = new LinkedList<>();

    public void addHabitat(Habitat habitat) {
        this.habitats.add(habitat);
        habitat.getActions().add(this);
    }

    public void addMultipleHabitats(List<Habitat> habitats) {
        for (Habitat habitat:habitats) addHabitat(habitat);
    }

    public List<DtoHabitat> retrieveHabitatsDTO() {
        return MyConverter.convertToDTOList(this.habitats);
    }



    @JsonInclude(value = JsonInclude.Include.CUSTOM, valueFilter = LazyFieldsFilter.class)
    @ManyToMany(cascade = {CascadeType.PERSIST, CascadeType.MERGE, CascadeType.REFRESH})
    @JoinTable(name = "action_animal",
            joinColumns = { @JoinColumn(name = "action_id") },
            inverseJoinColumns = { @JoinColumn(name = "animal_id") })
    private List<Animal> animals = new LinkedList<>();

    public void addAnimal(Animal animal) {
        this.animals.add(animal);
        animal.getActions().add(this);
    }

    public void addMultipleAnimals(List<Animal> animals) {
        for (Animal animal:animals) addAnimal(animal);
    }


    public List<DtoAnimal> retrieveAnimalsDTO() {
        return MyConverter.convertToDTOList(this.animals);
    }



    public List<AnimalHistory> retrieveAllAnimalHistory() {
        return this.animals.stream()
                .flatMap(animal -> animal.getHistory().stream())
                .filter(history -> isWithinTimeRange(history.getTime(), this.startOfAction, this.endOfAction))
                .collect(Collectors.toList());
    }

    public List<DtoAnimalHistory> retrieveAllAnimalHistoryDTO() {
        return MyConverter.convertToDTOList(retrieveAllAnimalHistory());
    }

    public List<Location> retrieveAllAnimalStatistics() {
        return MyConverter.convertToLocationList(retrieveAllAnimalHistory());
    }

    public List<AnimalHistory> retrieveAnimalHistoryBySpecies(String speciesName) {
        return this.animals.stream()
                .filter(animal -> animal.getSpecies().getName().equals(speciesName))
                .flatMap(animal -> animal.getHistory().stream())
                .filter(history -> isWithinTimeRange(history.getTime(), this.startOfAction, this.endOfAction))
                .collect(Collectors.toList());
    }

    public List<DtoAnimalHistory> retrieveAnimalHistoryBySpeciesDTO(String speciesName) {
        return MyConverter.convertToDTOList(retrieveAnimalHistoryBySpecies(speciesName));
    }


    public List<Location> retrieveAnimalStatisticsBySpecies(String speciesName) {
        return MyConverter.convertToLocationList(retrieveAnimalHistoryBySpecies(speciesName));
    }

    public List<AnimalHistory> retrieveAnimalHistoryByAnimalId(Long animalId) {
        return this.animals.stream()
                .filter(animal -> animal.getId().equals(animalId))
                .findFirst()
                .map(animal -> animal.getHistory().stream()
                        .filter(history -> isWithinTimeRange(history.getTime(), this.startOfAction, this.endOfAction))
                        .collect(Collectors.toList()))
                .orElse(Collections.emptyList());
    }

    public List<DtoAnimalHistory> retrieveAnimalHistoryByAnimalIdDTO(Long animalId) {
        return MyConverter.convertToDTOList(retrieveAnimalHistoryByAnimalId(animalId));
    }


    public List<Location> retrieveAnimalStatisticsByAnimalId(Long animalId) {
        return MyConverter.convertToLocationList(retrieveAnimalHistoryByAnimalId(animalId));
    }


    @JsonInclude(value = JsonInclude.Include.CUSTOM, valueFilter = LazyFieldsFilter.class)
    @OneToMany(mappedBy = "action", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<TrackerActionMedium> trackerActionMedia = new LinkedList<>();


    public List<DtoTrackerActionMedium> retrieveTrackerActionMediaDTO() {
        return MyConverter.convertToDTOList(this.trackerActionMedia);
    }


    public List<TrackerHistory> retrieveAllTrackerHistory() {
        return this.trackerActionMedia.stream()
                .flatMap(tam -> tam.getTracker().getHistory().stream())
                .filter(history -> isWithinTimeRange(history.getTime(), this.startOfAction, this.endOfAction))
                .collect(Collectors.toList());
    }


    public List<DtoTrackerHistory> retrieveAllTrackerHistoryDTO() {
        return MyConverter.convertToDTOList(retrieveAllTrackerHistory());
    }

    public List<Location> retrieveAllTrackerStatistics() {
        return MyConverter.convertToLocationList(retrieveAllTrackerHistory());
    }

    public List<TrackerHistory> retrieveTrackerHistoryByMedium(MediumType mediumType) {
        return this.trackerActionMedia.stream()
                .filter(tam -> tam.getMedium().getType()==mediumType)
                .flatMap(tam -> tam.getTracker().getHistory().stream())
                .filter(history -> isWithinTimeRange(history.getTime(), this.startOfAction, this.endOfAction))
                .collect(Collectors.toList());
    }


    public List<DtoTrackerHistory> retrieveTrackerHistoryByMediumDTO(MediumType mediumType) {
        return MyConverter.convertToDTOList(retrieveTrackerHistoryByMedium(mediumType));
    }

    public List<Location> retrieveTrackerStatisticsByMedium(MediumType mediumType) {
        return MyConverter.convertToLocationList(retrieveTrackerHistoryByMedium(mediumType));
    }


    public List<TrackerHistory> retrieveTrackerHistoryByTrackerId(Long trackerId) {
        return this.trackerActionMedia.stream()
                .filter(tam -> tam.getTracker().getId().equals(trackerId))
                .findFirst()
                .map(tam -> tam.getTracker().getHistory().stream()
                        .filter(history -> isWithinTimeRange(history.getTime(), this.startOfAction, this.endOfAction))
                        .collect(Collectors.toList()))
                .orElse(Collections.emptyList());
    }


    public List<DtoTrackerHistory> retrieveTrackerHistoryByTrackerIdDTO(Long trackerId) {
        return MyConverter.convertToDTOList(retrieveTrackerHistoryByTrackerId(trackerId));
    }


    public List<Location> retrieveTrackerStatisticsByTrackerId(Long trackerId) {
        return MyConverter.convertToLocationList(retrieveTrackerHistoryByTrackerId(trackerId));
    }


}
