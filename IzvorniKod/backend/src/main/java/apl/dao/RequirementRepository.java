package apl.dao;

import apl.domain.Action;
import apl.domain.TrackerRequirement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RequirementRepository extends JpaRepository<TrackerRequirement, Long> {


}
