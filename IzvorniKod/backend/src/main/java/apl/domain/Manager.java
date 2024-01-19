package apl.domain;

import apl.converters.ConvertibleToDTO;
import apl.converters.MyConverter;
import apl.dto.*;
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
import lombok.ToString;
import org.hibernate.annotations.Cascade;
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
        scope = Manager.class)
public class Manager extends User {
    public Manager(User user) {
        this.setId(user.getId());
        this.setUsername(user.getUsername());
        this.setRole(user.getRole());
        this.setPhoto(user.getPhoto());
        this.setPassword(user.getPassword());
        this.setName(user.getName());
        this.setSurname(user.getSurname());
        this.setEmail(user.getEmail());
    }


    public static List<DtoManager> convertToManagerDTOList(List<Manager> entityList) {
        if (entityList == null) {
            return Collections.emptyList();  // Return an empty list if the argument is null
        }

        return entityList.stream()
                .map(Manager::toManagerDTO)
                .collect(Collectors.toList());
    }

    public DtoManager toManagerDTO() {
        if (this.getId()==null) return null;
        Set<EntityWrapper> entities = new HashSet<>();
        entities.add(new EntityWrapper(this.getClass(), this.getId()));
        DtoManager manager = new DtoManager();
        manager.setId(this.getId());
        manager.setUsername(this.getUsername());
        manager.setRole(this.getRole());
        manager.setPhoto(this.getPhoto());
        manager.setPassword(this.getPassword());
        manager.setName(this.getName());
        manager.setSurname(this.getSurname());
        manager.setEmail(this.getEmail());
        manager.setRegistered(this.isRegistered());
        manager.setApproved(this.approved);
        if (this.station!=null) manager.setStation(this.station.toDTO(entities));
        return manager;
    }

    DtoManager toManagerDTO(Set<EntityWrapper> entities) {
        if (this.getId()==null) return null;
        Set<EntityWrapper> localEntities = new HashSet<>(entities);
        EntityWrapper thEntity = new EntityWrapper(this.getClass(), this.getId());
        if (localEntities.contains(thEntity)) return null;
        localEntities.add(thEntity);
        DtoManager manager = new DtoManager();
        manager.setId(this.getId());
        manager.setUsername(this.getUsername());
        manager.setRole(this.getRole());
        manager.setPhoto(this.getPhoto());
        manager.setPassword(this.getPassword());
        manager.setName(this.getName());
        manager.setSurname(this.getSurname());
        manager.setEmail(this.getEmail());
        manager.setRegistered(this.isRegistered());
        manager.setApproved(this.approved);
        if (this.station!=null) manager.setStation(this.station.toDTO(localEntities));
        return manager;
    }


    @Column(nullable = false)
    private boolean approved = false;

    @OneToOne(cascade = {CascadeType.PERSIST, CascadeType.MERGE, CascadeType.REFRESH})
    @JoinColumn(name = "station_id")
    private Station station;

    public void assignStation(Station station) {
        this.station=station;
        station.setManager(this);
    }

    public DtoStation retrieveStationDTO() {
        if (this.station==null) return null;
        return this.station.toDTO();
    }

    @JsonInclude(value = JsonInclude.Include.CUSTOM, valueFilter = LazyFieldsFilter.class)
    @OneToMany(mappedBy = "manager", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Action> actions = new LinkedList<>();

    public void addAction (Action action) {
        this.actions.add(action);
        action.setManager(this);
    }

    public void addMultipleActions(List<Action> actions) {
        for (Action action:actions) addAction(action);
    }

    public List<DtoAction> retrieveActionsDTO() {
        return MyConverter.convertToDTOList(this.actions);
    }

}
