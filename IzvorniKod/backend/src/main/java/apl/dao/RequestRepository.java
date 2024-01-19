package apl.dao;

import apl.domain.*;
import apl.enums.RequestStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;


@Repository
public interface RequestRepository extends JpaRepository<Request, Long> {

    List<Request> findByActionManagerIdAndRequestStatus(Long managerId, RequestStatus status);

    Optional<Request> findById(Long id);

}
