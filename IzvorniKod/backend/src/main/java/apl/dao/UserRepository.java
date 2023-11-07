package apl.dao;

import apl.domain.User;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

//ovdje pisemo funkcije koje rade s podacima, vecinom necemo morat definirat funkciju jer on sve vec pretpostavi sam
//ravno iz baze uzimamo, takve su funkcije

@Repository
@Transactional
public interface UserRepository extends JpaRepository<User, Long> {
    //komunicira s bazom
    //<User, Long> tip entiteta i tip IDa

    int countByUsername(String username);

    int countByEmail(String email);

    //@Query("UPDATE my_user a " +
     //       "SET a.registered = TRUE WHERE a.email = ?1")
    @Transactional
    @Modifying
    @Query("UPDATE User u SET u.registered = true WHERE u.email = ?1")
    int enableUser(String emailParam);
}
