package apl.domain;

import apl.converters.MyConverter;
import apl.dto.DtoAction;
import apl.dto.DtoAnimal;
import apl.dto.DtoResearcher;
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
        scope = Researcher.class)
public class Researcher extends User {
    public Researcher(User user) {
        this.setId(user.getId());
        this.setUsername(user.getUsername());
        this.setRole(user.getRole());
        this.setPhoto(user.getPhoto());
        this.setPassword(user.getPassword());
        this.setName(user.getName());
        this.setSurname(user.getSurname());
        this.setEmail(user.getEmail());
    }


    public static List<DtoResearcher> convertToResearcherDTOList(List<Researcher> entityList) {
        if (entityList == null) {
            return Collections.emptyList();  // Return an empty list if the argument is null
        }

        return entityList.stream()
                .map(Researcher::toResearcherDTO)
                .collect(Collectors.toList());
    }

    public DtoResearcher toResearcherDTO() {
        if (this.getId()==null) return null;
        Set<EntityWrapper> entities = new HashSet<>();
        entities.add(new EntityWrapper(this.getClass(), this.getId()));
        DtoResearcher researcher = new DtoResearcher();
        researcher.setId(this.getId());
        researcher.setUsername(this.getUsername());
        researcher.setRole(this.getRole());
        researcher.setPhoto(this.getPhoto());
        researcher.setPassword(this.getPassword());
        researcher.setName(this.getName());
        researcher.setSurname(this.getSurname());
        researcher.setEmail(this.getEmail());
        researcher.setRegistered(this.isRegistered());
        researcher.setApproved(this.approved);
        return researcher;
    }

    DtoResearcher toResearcherDTO(Set<EntityWrapper> entities) {
        if (this.getId()==null) return null;
        Set<EntityWrapper> localEntities = new HashSet<>(entities);
        EntityWrapper thEntity = new EntityWrapper(this.getClass(), this.getId());
        if (localEntities.contains(thEntity)) return null;
        localEntities.add(thEntity);
        DtoResearcher researcher = new DtoResearcher();
        researcher.setId(this.getId());
        researcher.setUsername(this.getUsername());
        researcher.setRole(this.getRole());
        researcher.setPhoto(this.getPhoto());
        researcher.setPassword(this.getPassword());
        researcher.setName(this.getName());
        researcher.setSurname(this.getSurname());
        researcher.setEmail(this.getEmail());
        researcher.setRegistered(this.isRegistered());
        researcher.setApproved(this.approved);
        return researcher;
    }

    @Column(nullable = false)
    private boolean approved = false;


    @JsonInclude(value = JsonInclude.Include.CUSTOM, valueFilter = LazyFieldsFilter.class)
    @OneToMany(mappedBy = "researcher", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Action> actions = new LinkedList<>();

    public void addAction (Action action) {
        this.actions.add(action);
        action.setResearcher(this);
    }

    public void addMultipleActions(List<Action> actions) {
        for (Action action:actions) addAction(action);
    }

    public List<DtoAction> retrieveActionsDTO() {
        return MyConverter.convertToDTOList(this.actions);
    }

}
