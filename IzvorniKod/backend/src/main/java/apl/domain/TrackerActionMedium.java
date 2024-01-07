package apl.domain;

import apl.converters.ConvertibleToDTO;
import apl.dto.*;
import apl.entityWrapper.EntityWrapper;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.NoArgsConstructor;
import org.springframework.dao.DataIntegrityViolationException;
import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
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
        scope = TrackerActionMedium.class)
@Table(
        uniqueConstraints = {
                @UniqueConstraint(columnNames = {"tracker_id", "action_id"})
        }
)
public class TrackerActionMedium implements ConvertibleToDTO<DtoTrackerActionMedium> {


    public TrackerActionMedium(Tracker tracker, Action action, Medium medium) {
        this.tracker = tracker;
        this.action = action;
        this.medium = medium;
                                                        // not sure if works as desired, need to try
        tracker.getTrackerActionMedia().add(this);
        action.getTrackerActionMedia().add(this);
        medium.getTrackerActionMedia().add(this);
    }



    @Override
    public DtoTrackerActionMedium toDTO() {
        if (this.id==null) return null;
        Set<EntityWrapper> entities = new HashSet<>();
        entities.add(new EntityWrapper(this.getClass(), this.id));
        DtoTrackerActionMedium trackerActionMedium = new DtoTrackerActionMedium();
        trackerActionMedium.setId(this.id);
        if (this.tracker!=null) trackerActionMedium.setTracker(this.tracker.toTrackerDTO(entities));
        if (this.action!=null) trackerActionMedium.setAction(this.action.toDTO(entities));
        if (this.medium!=null) trackerActionMedium.setMedium(this.medium.toDTO(entities));
        return trackerActionMedium;
    }

    DtoTrackerActionMedium toDTO(Set<EntityWrapper> entities) {
        if (this.id==null) return null;
        Set<EntityWrapper> localEntities = new HashSet<>(entities);
        EntityWrapper thEntity = new EntityWrapper(this.getClass(), this.id);
        if (localEntities.contains(thEntity)) return null;
        localEntities.add(thEntity);
        DtoTrackerActionMedium trackerActionMedium = new DtoTrackerActionMedium();
        trackerActionMedium.setId(this.id);
        if (this.tracker!=null) trackerActionMedium.setTracker(this.tracker.toTrackerDTO(localEntities));
        if (this.action!=null) trackerActionMedium.setAction(this.action.toDTO(localEntities));
        if (this.medium!=null) trackerActionMedium.setMedium(this.medium.toDTO(localEntities));
        return trackerActionMedium;
    }



    public static List<Tracker> convertToTrackerList(List<TrackerActionMedium> entityList) {
        return entityList.stream()
                .map(TrackerActionMedium::getTracker)
                .collect(Collectors.toList());
    }

    public static List<Action> convertToActionList(List<TrackerActionMedium> entityList) {
        return entityList.stream()
                .map(TrackerActionMedium::getAction)
                .collect(Collectors.toList());
    }

    public static List<Medium> convertToMediumList(List<TrackerActionMedium> entityList) {
        return entityList.stream()
                .map(TrackerActionMedium::getMedium)
                .collect(Collectors.toList());
    }

    @Id
    @GeneratedValue
    private Long id;

    @ManyToOne(cascade = {CascadeType.PERSIST, CascadeType.MERGE, CascadeType.REFRESH}, optional = false)
    @JoinColumn(name = "tracker_id")
    private Tracker tracker;

    public DtoTracker retrieveTrackerDTO() {
        if (this.tracker==null) return null;
        return this.tracker.toTrackerDTO();
    }

    @ManyToOne(cascade = {CascadeType.PERSIST, CascadeType.MERGE, CascadeType.REFRESH}, optional = false)
    @JoinColumn(name = "action_id")
    private Action action;

    public DtoAction retrieveActionDTO() {
        if (this.action==null) return null;
        return this.action.toDTO();
    }

    @ManyToOne(cascade = {CascadeType.PERSIST, CascadeType.MERGE, CascadeType.REFRESH}, optional = false)
    @JoinColumn(name = "medium_type")
    private Medium medium;

    public DtoMedium retrieveMediumDTO() {
        if (this.medium==null) return null;
        return this.medium.toDTO();
    }

    @PrePersist
    @PreUpdate
    private void checkIfTrackerAlreadyHasActiveAction() {
        if (tracker.isTryingToHaveMultipleActiveActionsByMistake()) throw new DataIntegrityViolationException("Tracker already has an active action");
    }
}
