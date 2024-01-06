package apl.domain;

import apl.converters.ConvertibleToDTO;
import apl.dto.DtoAction;
import apl.dto.DtoAnimal;
import apl.dto.DtoRequest;
import apl.dto.DtoUser;
import apl.entityWrapper.EntityWrapper;
import apl.enums.HandleRequest;
import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import java.time.LocalDateTime;
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
        scope = Request.class)
public class Request implements ConvertibleToDTO<DtoRequest> {

    public Request(HandleRequest type, Action action, User user) {
        this.type = type;
        assignAction(action);
        assignUser(user);
    }



    @Override
    public DtoRequest toDTO() {
        if (this.id==null) return null;
        Set<EntityWrapper> entities = new HashSet<>();
        entities.add(new EntityWrapper(this.getClass(), this.id));
        DtoRequest request = new DtoRequest();
        request.setId(this.id);
        request.setType(this.type);
        request.setCreationTime(this.creationTime);
        if (this.action!=null) request.setAction(this.action.toDTO(entities));
        if (this.user!=null) request.setUser(this.user.toDTO(entities));
        return request;
    }

    DtoRequest toDTO(Set<EntityWrapper> entities) {
        if (this.id==null) return null;
        Set<EntityWrapper> localEntities = new HashSet<>(entities);
        EntityWrapper thEntity = new EntityWrapper(this.getClass(), this.id);
        if (localEntities.contains(thEntity)) return null;
        localEntities.add(thEntity);
        DtoRequest request = new DtoRequest();
        request.setId(this.id);
        request.setType(this.type);
        request.setCreationTime(this.creationTime);
        if (this.action!=null) request.setAction(this.action.toDTO(localEntities));
        if (this.user!=null) request.setUser(this.user.toDTO(localEntities));
        return request;
    }

    @Id
    @GeneratedValue
    private Long id;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private HandleRequest type;


    @Column(nullable = false)
    private LocalDateTime creationTime = LocalDateTime.now();       // vrijeme instanciranja

    @ManyToOne(cascade = {CascadeType.PERSIST, CascadeType.MERGE, CascadeType.REFRESH})
    @JoinColumn(name = "action_id")
    private Action action;

    public void assignAction(Action action) {
        this.action=action;
        action.getRequests().add(this);
    }

    public DtoAction retrieveActionDTO() {
        if (this.action==null) return null;
        return this.action.toDTO();
    }

    @ManyToOne(cascade = {CascadeType.PERSIST, CascadeType.MERGE, CascadeType.REFRESH}, optional = false)
    @JoinColumn(name = "user_id")
    private User user;

    public void assignUser(User user) {
        this.user=user;
        user.getRequests().add(this);
    }

    public DtoUser retrieveUserDTO() {
        if (this.user==null) return null;
        return this.user.toDTO();
    }
}
