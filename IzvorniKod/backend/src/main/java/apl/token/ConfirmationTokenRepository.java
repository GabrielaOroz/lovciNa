package apl.token;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.Optional;

@Repository
public interface ConfirmationTokenRepository extends JpaRepository<ConfirmationToken, Long> {

    Optional<ConfirmationToken> findByToken(String token);

    @Query("UPDATE ConfirmationToken c SET c.confirmedAt = :time WHERE c.token= :token")
    int updateConfirmedAt(@Param("token") String token, @Param("time") LocalDateTime confirmedAt);

}
