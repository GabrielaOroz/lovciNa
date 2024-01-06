package apl.domain;


import apl.converters.ConvertibleToDTO;
import apl.converters.MyConverter;
import apl.dto.*;
import apl.entityWrapper.EntityWrapper;
import apl.enums.MediumType;
import apl.filter.LazyFieldsFilter;
import com.fasterxml.jackson.annotation.JsonIdentityInfo;
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
        property = "type",
        scope = Medium.class)
public class Medium implements ConvertibleToDTO<DtoMedium> {

    public Medium(MediumType type, boolean airline, Double radius, Double detail, Double speed) {
        this.type = type;
        this.airline = airline;
        this.radius = radius;
        this.detail = detail;
        this.speed = speed;
    }



    @Override
    public DtoMedium toDTO() {
        if (this.type==null) return null;
        Set<EntityWrapper> entities = new HashSet<>();
        entities.add(new EntityWrapper(this.getClass(), this.type));
        DtoMedium medium = new DtoMedium();
        medium.setType(this.type);
        medium.setAirline(this.airline);
        medium.setRadius(this.radius);
        medium.setDetail(this.detail);
        medium.setSpeed(this.speed);
        return medium;
    }

    DtoMedium toDTO(Set<EntityWrapper> entities) {
        if (this.type==null) return null;
        Set<EntityWrapper> localEntities = new HashSet<>(entities);
        EntityWrapper thEntity = new EntityWrapper(this.getClass(), this.type);
        if (localEntities.contains(thEntity)) return null;
        localEntities.add(thEntity);
        DtoMedium medium = new DtoMedium();
        medium.setType(this.type);
        medium.setAirline(this.airline);
        medium.setRadius(this.radius);
        medium.setDetail(this.detail);
        medium.setSpeed(this.speed);
        return medium;
    }

    @Id
    @Enumerated(EnumType.STRING)
    private MediumType type;

    private boolean airline;

    private Double radius;

    private Double detail;

    private Double speed;

    @JsonInclude(value = JsonInclude.Include.CUSTOM, valueFilter = LazyFieldsFilter.class)
    @ManyToMany(cascade = {CascadeType.PERSIST, CascadeType.MERGE, CascadeType.REFRESH})
    @JoinTable(name = "qualification",
            joinColumns = { @JoinColumn(name = "medium_type") },
            inverseJoinColumns = { @JoinColumn(name = "tracker_id") })
    private List<Tracker> trackers = new LinkedList<>();

    public void addTracker(Tracker tracker) {
        this.trackers.add(tracker);
        tracker.getQualification().add(this);
    }

    public void addMultipleTrackers(List<Tracker> trackers) {
        for (Tracker tracker:trackers) addTracker(tracker);
    }


    public List<DtoTracker> retrieveTrackersDTO() {
        return Tracker.convertToTrackerDTOList(this.trackers);
    }

    @JsonInclude(value = JsonInclude.Include.CUSTOM, valueFilter = LazyFieldsFilter.class)
    @OneToMany(mappedBy = "medium", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<TrackerActionMedium> trackerActionMedia = new LinkedList<>();

    public List<DtoTrackerActionMedium> retrieveTrackerActionMediaDTO() {
        return MyConverter.convertToDTOList(this.trackerActionMedia);
    }



}
