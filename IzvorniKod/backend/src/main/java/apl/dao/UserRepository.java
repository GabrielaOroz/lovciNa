package apl.dao;

import apl.domain.ChangeUserDTO;
import apl.domain.User;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

//ovdje pisemo funkcije koje rade s podacima, vecinom necemo morat definirat funkciju jer on sve vec pretpostavi sam
//ravno iz baze uzimamo, takve su funkcije

@Repository
@Transactional
public interface UserRepository extends JpaRepository<User, Long> {
    //komunicira s bazom
    //<User, Long> tip entiteta i tip IDa

    Optional<User> findByUsername(String username);
    List<User> findByRole(String role);
    List<User> findByName(String name);
    List<User> findBySurname(String surname);
    Optional<User> findByEmail(String email);
    List<User> findByRegistered(boolean registered);

    //@Override
    //Optional<User> findById(Long id);

    int countByUsername(String username);
    int countByEmail(String email);


    @Transactional
    @Query("SELECT u FROM User u WHERE u.registered = true")
    List<User> listAllRegistered();

    //@Query("UPDATE my_user a " +
     //       "SET a.registered = TRUE WHERE a.email = ?1")
    @Transactional
    @Modifying
    @Query("UPDATE User u SET u.registered = true WHERE u.email = ?1")
    int enableUser(String emailParam);



}
