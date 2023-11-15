package apl.token;

import jakarta.transaction.Transactional;
import org.jetbrains.annotations.NotNull;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.Optional;

@Repository
public interface ConfirmationTokenRepository extends JpaRepository<ConfirmationToken, Long> {

    Optional<ConfirmationToken> findByToken(String token);
    @Transactional
    @Modifying
    @Query("UPDATE ConfirmationToken c SET c.confirmedAt = ?2 WHERE c.token= ?1")
    int updateConfirmedAt(String token, LocalDateTime confirmedAt);

    @Transactional
    void deleteById(@NotNull Long id);


    void deleteByExpiresAt(LocalDateTime date);

}
