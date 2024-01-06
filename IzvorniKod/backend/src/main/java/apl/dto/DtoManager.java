package apl.dto;

import apl.domain.*;
import apl.filter.LazyFieldsFilter;
import apl.serializers.DtoManagerCustomSerializer;
import apl.serializers.DtoUserCustomSerializer;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;
import org.jetbrains.annotations.NotNull;

import java.util.LinkedList;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@ToString
@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonSerialize(using = DtoManagerCustomSerializer.class)
public class DtoManager extends DtoUser {

    private boolean approved;

    private DtoStation station;

    private List<DtoAction> actions;

}