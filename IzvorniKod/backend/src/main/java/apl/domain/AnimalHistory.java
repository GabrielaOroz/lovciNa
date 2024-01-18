package apl.domain;

import apl.converters.ConvertibleToDTO;
import apl.converters.ConvertibleToLocation;
import apl.dto.DtoAnimal;
import apl.dto.DtoAnimalHistory;
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
        scope = AnimalHistory.class)
@Table(uniqueConstraints = {
        @UniqueConstraint(columnNames = {"animal_id", "time"})
})
public class AnimalHistory implements ConvertibleToDTO<DtoAnimalHistory>, ConvertibleToLocation {

    public AnimalHistory(Animal animal, LocalDateTime time, Double longitude, Double latitude) {
        assignAnimal(animal);
        this.time = time;
        this.longitude = longitude;
        this.latitude = latitude;
    }


    @Override
    public DtoAnimalHistory toDTO() {
        if (this.id==null) return null;
        Set<EntityWrapper> entities = new HashSet<>();
        entities.add(new EntityWrapper(this.getClass(), this.id));
        DtoAnimalHistory animalHistory = new DtoAnimalHistory();
        animalHistory.setId(this.id);
        if (this.animal!=null) animalHistory.setAnimal(this.animal.toDTO(entities));
        animalHistory.setTime(this.time);
        animalHistory.setLongitude(this.longitude);
        animalHistory.setLatitude(this.latitude);
        return animalHistory;
    }

    DtoAnimalHistory toDTO(Set<EntityWrapper> entities) {
        if (this.id==null) return null;
        Set<EntityWrapper> localEntities = new HashSet<>(entities);
        EntityWrapper thEntity = new EntityWrapper(this.getClass(), this.id);
        if (localEntities.contains(thEntity)) return null;
        localEntities.add(thEntity);
        DtoAnimalHistory animalHistory = new DtoAnimalHistory();
        animalHistory.setId(this.id);
        if (this.animal!=null) animalHistory.setAnimal(this.animal.toDTO(localEntities));
        animalHistory.setTime(this.time);
        animalHistory.setLongitude(this.longitude);
        animalHistory.setLatitude(this.latitude);
        return animalHistory;
    }


    @Override
    public Location toLocation() {
        return new Location(this.longitude, this.latitude);
    }

    @Id
    @GeneratedValue
    private Long id;

    @ManyToOne(cascade = {CascadeType.PERSIST, CascadeType.MERGE, CascadeType.REFRESH}, optional = false)
    @JoinColumn(name = "animal_id")
    private Animal animal;

    public void assignAnimal(Animal animal) {
        this.animal=animal;
        animal.getHistory().add(this);
    }

    public DtoAnimal retrieveAnimalDTO() {
        if (this.animal==null) return null;
        return this.animal.toDTO();
    }

    @Column(name = "time", nullable = true)
    private LocalDateTime time;

    @Column(nullable = false)
    private Double longitude;

    @Column(nullable = false)
    private Double latitude;

}
