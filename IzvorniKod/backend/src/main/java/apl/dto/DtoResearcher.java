package apl.dto;

import apl.domain.*;
import apl.serializers.DtoResearcherCustomSerializer;
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
@JsonSerialize(using = DtoResearcherCustomSerializer.class)
public class DtoResearcher extends DtoUser {


    private boolean approved;


    private List<DtoAction> actions;


}