package apl.domain;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;

@Entity
public class LogInDTO {

    @Id
    private String username;
    private String password;

    public void LogInDto() {
    }

    public String getUsername() {
        return username;
    }
    public void setUsername(String username) {
        this.username = username;
    }
    public String getPassword() {
        return password;
    }
    public void setPassword(String password) {
        this.password = password;
    }

}
