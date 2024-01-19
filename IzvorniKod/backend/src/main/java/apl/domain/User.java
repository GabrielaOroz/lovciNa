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
import lombok.*;
import org.jetbrains.annotations.NotNull;

import java.util.HashSet;
import java.util.LinkedList;
import java.util.List;
import java.util.Set;



@Entity
@Getter
@Setter
@ToString
@NoArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonIdentityInfo(
        generator = ObjectIdGenerators.PropertyGenerator.class,
        property = "id",
        scope = User.class)
@Inheritance(strategy = InheritanceType.JOINED)
@Table(name = "my_user")
public class User implements ConvertibleToDTO<DtoUser> {

    private static final String EMAIL_REGEX = "^\\w+([.-]?\\w+)*@\\w+([.-]?\\w+)*(\\.\\w{2,3})+$";
    private static final String NAME_REGEX = "^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$";
    private static final String SURNAME_REGEX = "^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$";
    private static final String USERNAME_REGEX = "^\\w+$";

    public User(@NotNull String username, @NotNull String role, byte[] photo, @NotNull String password, @NotNull String name, @NotNull String surname, @NotNull String email) {
        this.username = username;
        this.role = role;
        this.photo = photo;
        this.password = password;
        this.name = name;
        this.surname = surname;
        this.email = email;
    }



    @Override
    public DtoUser toDTO() {
        if (this.getId()==null) return null;
        Set<EntityWrapper> entities = new HashSet<>();
        entities.add(new EntityWrapper(this.getClass(), this.getId()));
        DtoUser user = new DtoUser();
        user.setId(this.getId());
        user.setUsername(this.getUsername());
        user.setRole(this.getRole());
        user.setPhoto(this.getPhoto());
        user.setPassword(this.getPassword());
        user.setName(this.getName());
        user.setSurname(this.getSurname());
        user.setEmail(this.getEmail());
        user.setRegistered(this.isRegistered());
        return user;
    }

    DtoUser toDTO(Set<EntityWrapper> entities) {
        if (this.getId()==null) return null;
        Set<EntityWrapper> localEntities = new HashSet<>(entities);
        EntityWrapper thEntity = new EntityWrapper(this.getClass(), this.getId());
        if (localEntities.contains(thEntity)) return null;
        localEntities.add(thEntity);
        DtoUser user = new DtoUser();
        user.setId(this.getId());
        user.setUsername(this.getUsername());
        user.setRole(this.getRole());
        user.setPhoto(this.getPhoto());
        user.setPassword(this.getPassword());
        user.setName(this.getName());
        user.setSurname(this.getSurname());
        user.setEmail(this.getEmail());
        user.setRegistered(this.isRegistered());
        return user;
    }


    @Id
    @GeneratedValue
    private Long id;

    @NotNull
    @Column(unique = true, nullable = false)
    private String username;

    @NotNull
    @Column(nullable = false)
    private String role;

    @JsonIgnore
    @Column(name = "photo", columnDefinition = "bytea")
    private byte[] photo;

    @NotNull
    @JsonIgnore
    @Column(nullable = false)
    private String password;

    @NotNull
    @Column(nullable = false)
    private String name;

    @NotNull
    @Column(nullable = false)
    private String surname;

    @NotNull
    @Column(unique = true, nullable = false)
    private String email;

    @Column(nullable = false)
    private boolean registered = false;   //je li potvrdio racun preko maila, prvotno false

    @JsonInclude(value = JsonInclude.Include.CUSTOM, valueFilter = LazyFieldsFilter.class)
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("creationTime ASC")
    private List<ActionComment> actionComments = new LinkedList<>();

    public void addActionComment (ActionComment actionComment) {
        this.actionComments.add(actionComment);
        actionComment.setUser(this);
    }

    public void addMultipleActionComments(List<ActionComment> actionComments) {
        for (ActionComment actionComment:actionComments) addActionComment(actionComment);
    }

    public List<DtoActionComment> retrieveActionCommentsDTO() {
        return MyConverter.convertToDTOList(this.actionComments);
    }


    @JsonInclude(value = JsonInclude.Include.CUSTOM, valueFilter = LazyFieldsFilter.class)
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("creationTime ASC")
    private List<AnimalComment> animalComments = new LinkedList<>();

    public void addAnimalComment (AnimalComment animalComment) {
        this.animalComments.add(animalComment);
        animalComment.setUser(this);
    }

    public void addMultipleAnimalComments(List<AnimalComment> animalComments) {
        for (AnimalComment animalComment:animalComments) addAnimalComment(animalComment);
    }

    public List<DtoAnimalComment> retrieveAnimalCommentsDTO() {
        return MyConverter.convertToDTOList(this.animalComments);
    }

    @JsonInclude(value = JsonInclude.Include.CUSTOM, valueFilter = LazyFieldsFilter.class)
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("creationTime ASC")
    private List<Request> requests = new LinkedList<>();

    public void addRequest (Request request) {
        this.requests.add(request);
        request.setUser(this);
    }

    public void addMultipleRequests(List<Request> requests) {
        for (Request request:requests) addRequest(request);
    }


    public List<DtoRequest> retrieveRequestsDTO() {
        return MyConverter.convertToDTOList(this.requests);
    }

    @JsonIgnore
    @Transient
    private transient boolean includePhoto = false;

    @JsonIgnore
    @Transient
    private transient boolean includePassword = false;


    @PrePersist
    @PreUpdate
    private void beforeSaveOrUpdate() {
        validateEmail();
        validateName();
        validateSurname();
        validateUsername();
    }

    private void validateEmail() {
        if (!email.matches(EMAIL_REGEX)) {
            throw new IllegalStateException("Invalid email format");
        }
    }

    private void validateName() {
        if (!name.matches(NAME_REGEX)) {
            throw new IllegalStateException("Invalid name format");
        }
    }

    private void validateSurname() {
        if (!surname.matches(SURNAME_REGEX)) {
            throw new IllegalStateException("Invalid surname format");
        }
    }

    private void validateUsername() {
        if (!username.matches(USERNAME_REGEX)) {
            throw new IllegalStateException("Invalid username format");
        }
    }
}
