package apl.domain;

import apl.converters.ConvertibleToLocation;
import apl.converters.MyConverter;
import apl.dto.*;
import apl.entityWrapper.EntityWrapper;
import apl.enums.ActionStatus;
import apl.filter.LazyFieldsFilter;
import apl.location.Location;
import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;
import org.jetbrains.annotations.NotNull;

import java.util.*;
import java.util.stream.Collectors;

@Entity
@Getter
@Setter
@ToString
@NoArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonIdentityInfo(
        generator = ObjectIdGenerators.PropertyGenerator.class,
        property = "id",
        scope = Tracker.class)
public class Tracker extends User implements ConvertibleToLocation {

    public Tracker(User user) {
        this.setId(user.getId());
        this.setUsername(user.getUsername());
        this.setRole(user.getRole());
        this.setPhoto(user.getPhoto());
        this.setPassword(user.getPassword());
        this.setName(user.getName());
        this.setSurname(user.getSurname());
        this.setEmail(user.getEmail());
    }


    public static List<DtoTracker> convertToTrackerDTOList(List<Tracker> entityList) {
        if (entityList == null) {
            return Collections.emptyList();  // Return an empty list if the argument is null
        }

        return entityList.stream()
                .map(Tracker::toTrackerDTO)
                .collect(Collectors.toList());
    }

    public DtoTracker toTrackerDTO() {
        if (this.getId()==null) return null;
        Set<EntityWrapper> entities = new HashSet<>();
        entities.add(new EntityWrapper(this.getClass(), this.getId()));
        DtoTracker tracker = new DtoTracker();
        tracker.setId(this.getId());
        tracker.setUsername(this.getUsername());
        tracker.setRole(this.getRole());
        tracker.setPhoto(this.getPhoto());
        tracker.setPassword(this.getPassword());
        tracker.setName(this.getName());
        tracker.setSurname(this.getSurname());
        tracker.setEmail(this.getEmail());
        tracker.setRegistered(this.isRegistered());
        if (this.station!=null) tracker.setStation(this.station.toDTO(entities));
        tracker.setLongitude(this.longitude);
        tracker.setLatitude(this.latitude);
        return tracker;
    }

    DtoTracker toTrackerDTO(Set<EntityWrapper> entities) {
        if (this.getId()==null) return null;
        Set<EntityWrapper> localEntities = new HashSet<>(entities);
        EntityWrapper thEntity = new EntityWrapper(this.getClass(), this.getId());
        if (localEntities.contains(thEntity)) return null;
        localEntities.add(thEntity);
        DtoTracker tracker = new DtoTracker();
        tracker.setId(this.getId());
        tracker.setUsername(this.getUsername());
        tracker.setRole(this.getRole());
        tracker.setPhoto(this.getPhoto());
        tracker.setPassword(this.getPassword());
        tracker.setName(this.getName());
        tracker.setSurname(this.getSurname());
        tracker.setEmail(this.getEmail());
        tracker.setRegistered(this.isRegistered());
        if (this.station!=null) tracker.setStation(this.station.toDTO(localEntities));
        tracker.setLongitude(this.longitude);
        tracker.setLatitude(this.latitude);
        return tracker;
    }


    public void updateLocation(Double longitude, Double latitude) {
        this.longitude=longitude;
        this.latitude=latitude;
    }


    @Override
    public Location toLocation() {
        return new Location(this.longitude, this.latitude);
    }


    public boolean isTryingToHaveMultipleActiveActionsByMistake() {
        int cnt=0;
        for (TrackerActionMedium trackerActionMedium : trackerActionMedia) {
            if (trackerActionMedium.getAction().getStatus() == ActionStatus.ACTIVE) {
                cnt++;
                if (cnt==2) return true;
            }
        }
        return false;
    }

    private Double longitude;

    private Double latitude;

    @ManyToOne(cascade = {CascadeType.PERSIST, CascadeType.MERGE, CascadeType.REFRESH})
    @JoinColumn(name = "station_id")
    private Station station;

    public void assignStation(Station station) {
        this.station=station;
        station.getTrackers().add(this);
    }

    public DtoStation retrieveStationDTO() {
        if (this.station==null) return null;
        return this.station.toDTO();
    }

    @JsonInclude(value = JsonInclude.Include.CUSTOM, valueFilter = LazyFieldsFilter.class)
    @OneToMany(mappedBy = "tracker", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("startOfTask ASC")
    private List<Task> tasks = new LinkedList<>();

    public void addTask(Task task) {
        this.tasks.add(task);
        task.setTracker(this);
    }

    public void addMultipleTasks(List<Task> tasks) {
        for (Task task:tasks) addTask(task);
    }


    public List<DtoTask> retrieveTasksDTO() {
        return MyConverter.convertToDTOList(this.tasks);
    }

    @JsonInclude(value = JsonInclude.Include.CUSTOM, valueFilter = LazyFieldsFilter.class)
    @OneToMany(mappedBy = "tracker", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("time ASC")
    private List<TrackerHistory> history = new LinkedList<>();

    public void addLocation (TrackerHistory location) {
        this.history.add(location);
        location.setTracker(this);
    }

    public void addMultipleLocations(List<TrackerHistory> locations) {
        for (TrackerHistory location:locations) addLocation(location);
    }

    public List<DtoTrackerHistory> retrieveHistoryDTO() {
        return MyConverter.convertToDTOList(this.history);
    }

    @JsonInclude(value = JsonInclude.Include.CUSTOM, valueFilter = LazyFieldsFilter.class)
    @ManyToMany(cascade = {CascadeType.PERSIST, CascadeType.MERGE, CascadeType.REFRESH}, mappedBy = "trackers")
    private List<Medium> qualification = new LinkedList<>();

    public void addMedium(Medium medium) {
        this.qualification.add(medium);
        medium.getTrackers().add(this);
    }

    public void addMultipleMedia(List<Medium> media) {
        for (Medium medium:media) addMedium(medium);
    }

    public List<DtoMedium> retrieveQualificationDTO() {
        return MyConverter.convertToDTOList(this.qualification);
    }

    @JsonInclude(value = JsonInclude.Include.CUSTOM, valueFilter = LazyFieldsFilter.class)
    @OneToMany(mappedBy = "tracker", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<TrackerActionMedium> trackerActionMedia = new LinkedList<>();


    public List<DtoTrackerActionMedium> retrieveTrackerActionMediaDTO() {
        return MyConverter.convertToDTOList(this.trackerActionMedia);
    }


}
