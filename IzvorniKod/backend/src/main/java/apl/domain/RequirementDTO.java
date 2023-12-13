package apl.domain;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class RequirementDTO {
    private String mediumType;

    private  Long amount;
}
