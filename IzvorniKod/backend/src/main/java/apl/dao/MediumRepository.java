package apl.dao;

import apl.domain.*;
import apl.enums.MediumType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;


@Repository
public interface MediumRepository extends JpaRepository<Medium, MediumType> {

    Optional<Medium> findByType(MediumType mediumType);
}
