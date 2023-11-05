package apl.dao;

import apl.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;

//ovdje pisemo funkcije koje rade s podacima, vecinom necemo morat definirat funkciju jer on sve vec pretpostavi sam
//ravno iz baze uzimamo, takve su funkcije

public interface UserRepository extends JpaRepository<User, Long> {
    //komunicira s bazom
    //<User, Long> tip entiteta i tip IDa

    int countByUsername(String username);

    int countByEmail(String email);
}
