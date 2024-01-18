package apl.domain;

import apl.converters.ConvertibleToDTO;
import apl.converters.ConvertibleToLocation;
import apl.dto.DtoAnimal;
import apl.dto.DtoTracker;
import apl.dto.DtoTrackerHistory;
import apl.entityWrapper.EntityWrapper;
import apl.location.Location;
import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
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
        scope = TrackerHistory.class)
@Table(uniqueConstraints = {
        @UniqueConstraint(columnNames = {"tracker_id", "time"})
})
public class TrackerHistory implements ConvertibleToDTO<DtoTrackerHistory>, ConvertibleToLocation {


    public TrackerHistory(Tracker tracker, LocalDateTime time, Double longitude, Double latitude) {
        assignTracker(tracker);
        this.time = time;
        this.longitude = longitude;
        this.latitude = latitude;
    }


    @Override
    public DtoTrackerHistory toDTO() {
        if (this.id==null) return null;
        Set<EntityWrapper> entities = new HashSet<>();
        entities.add(new EntityWrapper(this.getClass(), this.id));
        DtoTrackerHistory trackerHistory = new DtoTrackerHistory();
        trackerHistory.setId(this.id);
        if (this.tracker!=null) trackerHistory.setTracker(this.tracker.toTrackerDTO(entities));
        trackerHistory.setTime(this.time);
        trackerHistory.setLongitude(this.longitude);
        trackerHistory.setLatitude(this.latitude);
        return trackerHistory;
    }

    DtoTrackerHistory toDTO(Set<EntityWrapper> entities) {
        if (this.id==null) return null;
        Set<EntityWrapper> localEntities = new HashSet<>(entities);
        EntityWrapper thEntity = new EntityWrapper(this.getClass(), this.id);
        if (localEntities.contains(thEntity)) return null;
        localEntities.add(thEntity);
        DtoTrackerHistory trackerHistory = new DtoTrackerHistory();
        trackerHistory.setId(this.id);
        if (this.tracker!=null) trackerHistory.setTracker(this.tracker.toTrackerDTO(localEntities));
        trackerHistory.setTime(this.time);
        trackerHistory.setLongitude(this.longitude);
        trackerHistory.setLatitude(this.latitude);
        return trackerHistory;
    }



    @Override
    public Location toLocation() {
        return new Location(this.longitude, this.latitude);
    }


    @Id
    @GeneratedValue
    private Long id;

    @ManyToOne(cascade = {CascadeType.PERSIST, CascadeType.MERGE, CascadeType.REFRESH}, optional = false)
    @JoinColumn(name = "tracker_id")
    private Tracker tracker;

    public void assignTracker(Tracker tracker) {
        this.tracker=tracker;
        tracker.getHistory().add(this);
    }

    public DtoTracker retrieveTrackerDTO() {
        if (this.tracker==null) return null;
        return this.tracker.toTrackerDTO();
    }

    @Column(name = "time", nullable = true)
    private LocalDateTime time;

    @Column(nullable = false)
    private Double longitude;

    @Column(nullable = false)
    private Double latitude;

}
