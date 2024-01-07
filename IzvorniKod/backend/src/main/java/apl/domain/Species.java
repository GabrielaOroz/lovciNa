package apl.domain;

import apl.converters.ConvertibleToDTO;
import apl.converters.MyConverter;
import apl.dto.DtoAnimal;
import apl.dto.DtoSpecies;
import apl.entityWrapper.EntityWrapper;
import apl.filter.LazyFieldsFilter;
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
        scope = Species.class)
public class Species implements ConvertibleToDTO<DtoSpecies> {

    public Species(String name, String description, byte[] photo) {
        this.name = name;
        this.description = description;
        this.photo = photo;
    }


    @Override
    public DtoSpecies toDTO() {
        if (this.id==null) return null;
        Set<EntityWrapper> entities = new HashSet<>();
        entities.add(new EntityWrapper(this.getClass(), this.id));
        DtoSpecies species = new DtoSpecies();
        species.setId(this.id);
        species.setName(this.name);
        species.setDescription(this.description);
        species.setPhoto(this.photo);
        return species;
    }

    DtoSpecies toDTO(Set<EntityWrapper> entities) {
        if (this.id==null) return null;
        Set<EntityWrapper> localEntities = new HashSet<>(entities);
        EntityWrapper thEntity = new EntityWrapper(this.getClass(), this.id);
        if (localEntities.contains(thEntity)) return null;
        localEntities.add(thEntity);
        DtoSpecies species = new DtoSpecies();
        species.setId(this.id);
        species.setName(this.name);
        species.setDescription(this.description);
        species.setPhoto(this.photo);
        return species;
    }

    @Id
    @GeneratedValue
    private Long id;

    @Column(unique = true, nullable = false)
    private String name;

    private String description;

    @JsonIgnore
    private byte[] photo;

    @JsonInclude(value = JsonInclude.Include.CUSTOM, valueFilter = LazyFieldsFilter.class)
    @OneToMany(mappedBy = "species", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Animal> animals = new LinkedList<>();

    public void addAnimal (Animal animal) {
        this.animals.add(animal);
        animal.setSpecies(this);
    }

    public void addMultipleAnimals(List<Animal> animals) {
        for (Animal animal:animals) addAnimal(animal);
    }

    public List<DtoAnimal> retrieveAnimalsDTO() {
        return MyConverter.convertToDTOList(this.animals);
    }

    @JsonIgnore
    @Transient
    private transient boolean includePhoto = false;
}
