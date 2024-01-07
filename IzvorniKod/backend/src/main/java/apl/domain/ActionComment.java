package apl.domain;

import apl.converters.ConvertibleToDTO;
import apl.converters.ConvertibleToLocation;
import apl.dto.DtoAction;
import apl.dto.DtoActionComment;
import apl.dto.DtoManager;
import apl.dto.DtoUser;
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
        scope = ActionComment.class)
public class ActionComment implements ConvertibleToDTO<DtoActionComment>, ConvertibleToLocation {

    public ActionComment(User user, Action action, String title, String content, Double longitude, Double latitude) {
        assignUser(user);
        assignAction(action);
        setTitle(title);
        setContent(content);
        setLongitude(longitude);
        setLatitude(latitude);
    }



    @Override
    public DtoActionComment toDTO() {
        if (this.id==null) return null;
        Set<EntityWrapper> entities = new HashSet<>();
        entities.add(new EntityWrapper(this.getClass(), this.id));
        DtoActionComment actionComment = new DtoActionComment();
        actionComment.setId(this.id);
        if (this.user!=null) actionComment.setUser(this.user.toDTO(entities));
        if (this.action!=null) actionComment.setAction(this.action.toDTO(entities));
        actionComment.setTitle(this.title);
        actionComment.setContent(this.content);
        actionComment.setLongitude(this.longitude);
        actionComment.setLatitude(this.latitude);
        actionComment.setCreationTime(this.creationTime);
        return actionComment;
    }

    DtoActionComment toDTO(Set<EntityWrapper> entities) {
        if (this.id==null) return null;
        Set<EntityWrapper> localEntities = new HashSet<>(entities);
        EntityWrapper thEntity = new EntityWrapper(this.getClass(), this.id);
        if (localEntities.contains(thEntity)) return null;
        localEntities.add(thEntity);
        DtoActionComment actionComment = new DtoActionComment();
        actionComment.setId(this.id);
        if (this.user!=null) actionComment.setUser(this.user.toDTO(localEntities));
        if (this.action!=null) actionComment.setAction(this.action.toDTO(localEntities));
        actionComment.setTitle(this.title);
        actionComment.setContent(this.content);
        actionComment.setLongitude(this.longitude);
        actionComment.setLatitude(this.latitude);
        actionComment.setCreationTime(this.creationTime);
        return actionComment;
    }

    @Override
    public Location toLocation() {
        return new Location(this.longitude, this.latitude);
    }

    @Id
    @GeneratedValue
    private Long id;

    @ManyToOne(cascade = {CascadeType.PERSIST, CascadeType.MERGE, CascadeType.REFRESH}, optional = false)
    @JoinColumn(name = "user_id")
    private User user;

    public void assignUser(User user) {
        this.user=user;
        user.getActionComments().add(this);
    }

    public DtoUser retrieveUserDTO() {
        if (this.user==null) return null;
        return this.user.toDTO();
    }

    @ManyToOne(cascade = {CascadeType.PERSIST, CascadeType.MERGE, CascadeType.REFRESH}, optional = false)
    @JoinColumn(name = "action_id")
    private Action action;

    public void assignAction(Action action) {
        this.action=action;
        action.getActionComments().add(this);
    }

    public DtoAction retrieveActionDTO() {
        if (this.action==null) return null;
        return this.action.toDTO();
    }

    private String title;

    private String content;

    private Double longitude;

    private Double latitude;

    @Column(nullable = false)
    private LocalDateTime creationTime = LocalDateTime.now();

}
