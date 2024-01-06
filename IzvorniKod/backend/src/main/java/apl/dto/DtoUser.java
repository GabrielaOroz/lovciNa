package apl.dto;

import apl.converters.MyConverter;
import apl.domain.*;
import apl.location.Location;
import apl.serializers.DtoUserCustomSerializer;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@ToString
@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonSerialize(using = DtoUserCustomSerializer.class)
public class DtoUser {

    private Long id;

    private String username;

    private String role;


    private byte[] photo;


    private String password;


    private String name;

    private String surname;


    private String email;

    private boolean registered;


    private List<DtoActionComment> actionComments;


    private List<DtoAnimalComment> animalComments;

    private List<DtoRequest> requests;


    @JsonIgnore
    private transient boolean includePhoto = false;

    @JsonIgnore
    private transient boolean includePassword = false;
}