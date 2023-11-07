package apl.domain;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class LogInDTO {

    @Id
    private String username;
    private String password;

    public void LogInDto() {
    }
}
