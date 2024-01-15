package apl.dto;

import apl.domain.*;
import apl.filter.LazyFieldsFilter;
import apl.serializers.DtoSpeciesCustomSerializer;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import jakarta.persistence.CascadeType;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Transient;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import java.util.LinkedList;
import java.util.List;


@Getter
@Setter
@NoArgsConstructor
@ToString
@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonSerialize(using = DtoSpeciesCustomSerializer.class)
public class DtoSpecies {

    private Long id;

    private String name;

    private String description;

    private byte[] photo;

    private List<DtoAnimal> animals;

    @JsonIgnore
    private transient boolean includePhoto = false;
}