package apl.domain;

import apl.converters.ConvertibleToDTO;
import apl.dto.*;
import apl.entityWrapper.EntityWrapper;
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
        scope = AnimalComment.class)
public class AnimalComment implements ConvertibleToDTO<DtoAnimalComment> {

    public AnimalComment(Animal animal, User user, Action action, String title, String content) {
        assignAnimal(animal);
        assignUser(user);
        assignAction(action);
        setTitle(title);
        setContent(content);
    }


    @Override
    public DtoAnimalComment toDTO() {
        if (this.id==null) return null;
        Set<EntityWrapper> entities = new HashSet<>();
        entities.add(new EntityWrapper(this.getClass(), this.id));
        DtoAnimalComment animalComment = new DtoAnimalComment();
        animalComment.setId(this.id);
        if (this.animal!=null) animalComment.setAnimal(this.animal.toDTO(entities));
        if (this.user!=null) animalComment.setUser(this.user.toDTO(entities));
        if (this.action!=null) animalComment.setAction(this.action.toDTO(entities));
        animalComment.setTitle(this.title);
        animalComment.setContent(this.content);
        animalComment.setCreationTime(this.creationTime);
        return animalComment;
    }

    DtoAnimalComment toDTO(Set<EntityWrapper> entities) {
        if (this.id==null) return null;
        Set<EntityWrapper> localEntities = new HashSet<>(entities);
        EntityWrapper thEntity = new EntityWrapper(this.getClass(), this.id);
        if (localEntities.contains(thEntity)) return null;
        localEntities.add(thEntity);
        DtoAnimalComment animalComment = new DtoAnimalComment();
        animalComment.setId(this.id);
        if (this.animal!=null) animalComment.setAnimal(this.animal.toDTO(localEntities));
        if (this.user!=null) animalComment.setUser(this.user.toDTO(localEntities));
        if (this.action!=null) animalComment.setAction(this.action.toDTO(localEntities));
        animalComment.setTitle(this.title);
        animalComment.setContent(this.content);
        animalComment.setCreationTime(this.creationTime);
        return animalComment;
    }

    @Id
    @GeneratedValue
    private Long id;

    @ManyToOne(cascade = {CascadeType.PERSIST, CascadeType.MERGE, CascadeType.REFRESH}, optional = false)
    @JoinColumn(name = "animal_id")
    private Animal animal;

    public void assignAnimal(Animal animal) {
        this.animal=animal;
        animal.getComments().add(this);
    }

    public DtoAnimal retrieveAnimalDTO() {
        if (this.animal==null) return null;
        return this.animal.toDTO();
    }

    @ManyToOne(cascade = {CascadeType.PERSIST, CascadeType.MERGE, CascadeType.REFRESH}, optional = false)
    @JoinColumn(name = "user_id")
    private User user;

    public void assignUser(User user) {
        this.user=user;
        user.getAnimalComments().add(this);
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
        action.getAnimalComments().add(this);
    }

    public DtoAction retrieveActionDTO() {
        if (this.action==null) return null;
        return this.action.toDTO();
    }

    private String title;

    private String content;

    @Column(nullable = false)
    private LocalDateTime creationTime = LocalDateTime.now();

}
