package apl.domain;

import apl.converters.ConvertibleToDTO;
import apl.converters.ConvertibleToLocation;
import apl.dto.DtoAnimal;
import apl.dto.DtoManager;
import apl.dto.DtoStation;
import apl.dto.DtoTracker;
import apl.entityWrapper.EntityWrapper;
import apl.filter.LazyFieldsFilter;
import apl.location.Location;
import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;
import org.jetbrains.annotations.NotNull;

import java.util.HashSet;
import java.util.LinkedList;
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
        scope = Station.class)
public class Station implements ConvertibleToDTO<DtoStation>, ConvertibleToLocation {
    public Station(@NotNull String name, String description) {
        this.name = name;
        this.description = description;
    }

    public Station(@NotNull String name, String description, Double longitude, Double latitude) {
        this.name = name;
        this.description = description;
        this.longitude = longitude;
        this.latitude = latitude;
    }



    @Override
    public DtoStation toDTO() {
        if (this.id==null) return null;
        Set<EntityWrapper> entities = new HashSet<>();
        entities.add(new EntityWrapper(this.getClass(), this.id));
        DtoStation station = new DtoStation();
        station.setId(this.id);
        station.setName(this.name);
        station.setDescription(this.description);
        station.setLongitude(this.longitude);
        station.setLatitude(this.latitude);
        if (this.manager!=null) station.setManager(this.manager.toManagerDTO(entities));
        return station;
    }

    DtoStation toDTO(Set<EntityWrapper> entities) {
        if (this.id==null) return null;
        Set<EntityWrapper> localEntities = new HashSet<>(entities);
        EntityWrapper thEntity = new EntityWrapper(this.getClass(), this.id);
        if (localEntities.contains(thEntity)) return null;
        localEntities.add(thEntity);
        DtoStation station = new DtoStation();
        station.setId(this.id);
        station.setName(this.name);
        station.setDescription(this.description);
        station.setLongitude(this.longitude);
        station.setLatitude(this.latitude);
        if (this.manager!=null) station.setManager(this.manager.toManagerDTO(localEntities));
        return station;
    }



    @Override
    public Location toLocation() {
        return new Location(this.longitude, this.latitude);
    }

    @Id
    @GeneratedValue
    private Long id;

    @NotNull
    private String name;

    private String description;

    private Double longitude;

    private Double latitude;

    @OneToOne(cascade = {CascadeType.PERSIST, CascadeType.MERGE, CascadeType.REFRESH}, mappedBy = "station")
    private Manager manager;


    public void assignManager(Manager manager) {
        this.manager=manager;
        manager.setStation(this);
    }

    public DtoManager retrieveManagerDTO() {
        if (this.manager==null) return null;
        return this.manager.toManagerDTO();
    }

    @JsonInclude(value = JsonInclude.Include.CUSTOM, valueFilter = LazyFieldsFilter.class)
    @OneToMany(mappedBy = "station", cascade = {CascadeType.PERSIST, CascadeType.MERGE, CascadeType.REFRESH})
    private List<Tracker> trackers = new LinkedList<>();

    public void addTracker (Tracker tracker) {
        this.trackers.add(tracker);
        tracker.setStation(this);
    }

    public void addMultipleTrackers(List<Tracker> trackers) {
        for (Tracker tracker:trackers) addTracker(tracker);
    }


    public List<DtoTracker> retrieveTrackersDTO() {
        return Tracker.convertToTrackerDTOList(this.trackers);
    }
}

