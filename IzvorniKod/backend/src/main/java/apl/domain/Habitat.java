package apl.domain;

import apl.converters.ConvertibleToDTO;
import apl.converters.MyConverter;
import apl.dto.DtoAction;
import apl.dto.DtoAnimal;
import apl.dto.DtoHabitat;
import apl.entityWrapper.EntityWrapper;
import apl.filter.LazyFieldsFilter;
import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import jakarta.persistence.*;
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
        scope = Habitat.class)
public class Habitat implements ConvertibleToDTO<DtoHabitat> {


    public Habitat(Double longitude, Double latitude, Double radius, String name, String description, byte[] photo) {
        this.longitude = longitude;
        this.latitude = latitude;
        this.radius = radius;
        this.name = name;
        this.description = description;
        this.photo = photo;
    }


    @Override
    public DtoHabitat toDTO() {
        if (this.id==null) return null;
        Set<EntityWrapper> entities = new HashSet<>();
        entities.add(new EntityWrapper(this.getClass(), this.id));
        DtoHabitat habitat = new DtoHabitat();
        habitat.setId(this.id);
        habitat.setLongitude(this.longitude);
        habitat.setLatitude(this.latitude);
        habitat.setRadius(this.radius);
        habitat.setName(this.name);
        habitat.setDescription(this.description);
        habitat.setPhoto(this.photo);
        return habitat;
    }

    DtoHabitat toDTO(Set<EntityWrapper> entities) {
        if (this.id==null) return null;
        Set<EntityWrapper> localEntities = new HashSet<>(entities);
        EntityWrapper thEntity = new EntityWrapper(this.getClass(), this.id);
        if (localEntities.contains(thEntity)) return null;
        localEntities.add(thEntity);
        DtoHabitat habitat = new DtoHabitat();
        habitat.setId(this.id);
        habitat.setLongitude(this.longitude);
        habitat.setLatitude(this.latitude);
        habitat.setRadius(this.radius);
        habitat.setName(this.name);
        habitat.setDescription(this.description);
        habitat.setPhoto(this.photo);
        return habitat;
    }

    @Id
    @GeneratedValue
    private Long id;

    private Double longitude;

    private Double latitude;

    private Double radius;

    private String name;

    private String description;

    @JsonIgnore
    private byte[] photo;

    @JsonInclude(value = JsonInclude.Include.CUSTOM, valueFilter = LazyFieldsFilter.class)
    @ManyToMany(cascade = {CascadeType.PERSIST, CascadeType.MERGE, CascadeType.REFRESH}, mappedBy = "habitats")
    private List<Action> actions = new LinkedList<>();

    public void addAction(Action action) {
        this.actions.add(action);
        action.getHabitats().add(this);
    }

    public void addMultipleActions(List<Action> actions) {
        for (Action action:actions) addAction(action);
    }


    public List<DtoAction> retrieveActionsDTO() {
        return MyConverter.convertToDTOList(this.actions);
    }

    @JsonIgnore
    @Transient
    private transient boolean includePhoto = false;
}
